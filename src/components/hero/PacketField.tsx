'use client'

import { useEffect, useRef } from 'react'

type Node = { x: number; y: number; links: number[]; heat: number }
type Packet = { from: number; to: number; s: number; speed: number }
type Point = { x: number; y: number }

const TRAIL = 30
const CURSOR_RADIUS = 170
const rand = (seed: number) => { const v = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v) }

function buildGraph(width: number, height: number, count: number): Node[] {
  const cols = Math.max(3, Math.round(Math.sqrt((count * width) / height)))
  const rows = Math.max(3, Math.ceil(count / cols))
  const cw = width / cols
  const ch = height / rows
  const nodes: Node[] = []
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const i = r * cols + c
      nodes.push({ x: (c + 0.2 + rand(i) * 0.6) * cw, y: (r + 0.2 + rand(i + 99) * 0.6) * ch, links: [], heat: 0 })
    }
  }
  nodes.forEach((node, i) => {
    const nearest = nodes
      .map((other, j) => ({ j, d: (other.x - node.x) ** 2 + (other.y - node.y) ** 2 }))
      .filter((entry) => entry.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, rand(i + 7) > 0.6 ? 3 : 2)
    for (const { j } of nearest) {
      if (!node.links.includes(j)) node.links.push(j)
      if (!nodes[j].links.includes(i)) nodes[j].links.push(i)
    }
  })
  return nodes
}

// Edges are drawn as elbows: horizontal from the lower index, then vertical.
function edgeLength(a: Node, b: Node) { return Math.abs(b.x - a.x) + Math.abs(b.y - a.y) }

function pointOnEdge(nodes: Node[], from: number, to: number, s: number, out: Point) {
  const forward = from < to
  const a = nodes[forward ? from : to]
  const b = nodes[forward ? to : from]
  const length = edgeLength(a, b)
  const d = Math.min(Math.max(forward ? s : length - s, 0), length)
  const dx = Math.abs(b.x - a.x)
  if (d <= dx) { out.x = a.x + Math.sign(b.x - a.x) * d; out.y = a.y }
  else { out.x = b.x; out.y = a.y + Math.sign(b.y - a.y) * (d - dx) }
}

function cornerDistance(nodes: Node[], from: number, to: number) {
  const forward = from < to
  const a = nodes[forward ? from : to]
  const b = nodes[forward ? to : from]
  const dx = Math.abs(b.x - a.x)
  return forward ? dx : edgeLength(a, b) - dx
}

export default function PacketField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const styles = getComputedStyle(document.documentElement)
    const color = { line: styles.getPropertyValue('--c-line-strong').trim(), node: styles.getPropertyValue('--c-faint').trim(), signal: styles.getPropertyValue('--c-signal').trim() }
    const staticLayer = document.createElement('canvas')
    const staticCtx = staticLayer.getContext('2d')
    const head: Point = { x: 0, y: 0 }
    const tail: Point = { x: 0, y: 0 }
    const corner: Point = { x: 0, y: 0 }
    const pointer = { x: 0, y: 0, active: false }

    let width = 0
    let height = 0
    let dpr = 1
    let nodes: Node[] = []
    let packets: Packet[] = []
    let frame = 0
    let last = 0
    let born = 0
    let visible = true

    function nextHop(packet: Packet) {
      const node = nodes[packet.to]
      const options = node.links.filter((link) => link !== packet.from)
      const pool = options.length ? options : node.links
      let choice = pool[Math.floor(Math.random() * pool.length)]
      if (pointer.active && Math.random() < 0.75) {
        let best = Infinity
        for (const link of pool) {
          const d = (nodes[link].x - pointer.x) ** 2 + (nodes[link].y - pointer.y) ** 2
          if (d < best) { best = d; choice = link }
        }
      }
      packet.from = packet.to
      packet.to = choice
      packet.s = 0
    }

    function layout() {
      const rect = canvas!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      for (const target of [canvas!, staticLayer]) { target.width = Math.round(width * dpr); target.height = Math.round(height * dpr) }
      const count = Math.min(coarse ? 24 : 48, Math.max(14, Math.round((width * height) / 26000)))
      nodes = buildGraph(width, height, count)
      packets = Array.from({ length: Math.round(nodes.length * 0.55) }, (_, i) => {
        const from = Math.floor(rand(i + 401) * nodes.length)
        const to = nodes[from].links[0]
        return { from, to, s: rand(i + 503) * edgeLength(nodes[from], nodes[to]), speed: 55 + rand(i + 607) * 70 }
      })

      if (!staticCtx) return
      staticCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      staticCtx.clearRect(0, 0, width, height)
      staticCtx.strokeStyle = color.line
      staticCtx.lineWidth = 1
      staticCtx.globalAlpha = 0.7
      staticCtx.beginPath()
      nodes.forEach((a, i) => {
        for (const j of a.links) {
          if (j < i) continue
          const b = nodes[j]
          staticCtx.moveTo(a.x, a.y)
          staticCtx.lineTo(b.x, a.y)
          staticCtx.lineTo(b.x, b.y)
        }
      })
      staticCtx.stroke()
      staticCtx.globalAlpha = 1
      staticCtx.fillStyle = color.node
      for (const node of nodes) staticCtx.fillRect(node.x - 1.5, node.y - 1.5, 3, 3)
    }

    function render(intro: number) {
      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      ctx!.globalAlpha = intro
      ctx!.drawImage(staticLayer, 0, 0)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      ctx!.fillStyle = color.signal
      for (const node of nodes) {
        if (node.heat < 0.03) continue
        ctx!.globalAlpha = intro * node.heat
        ctx!.fillRect(node.x - 2.5, node.y - 2.5, 5, 5)
      }

      ctx!.strokeStyle = color.signal
      ctx!.lineWidth = 1.25
      for (const packet of packets) {
        pointOnEdge(nodes, packet.from, packet.to, packet.s, head)
        pointOnEdge(nodes, packet.from, packet.to, packet.s - TRAIL, tail)
        const bend = cornerDistance(nodes, packet.from, packet.to)
        ctx!.globalAlpha = intro * 0.55
        ctx!.beginPath()
        ctx!.moveTo(tail.x, tail.y)
        if (packet.s - TRAIL < bend && packet.s > bend) {
          pointOnEdge(nodes, packet.from, packet.to, bend, corner)
          ctx!.lineTo(corner.x, corner.y)
        }
        ctx!.lineTo(head.x, head.y)
        ctx!.stroke()
        ctx!.globalAlpha = intro
        ctx!.fillRect(head.x - 1.5, head.y - 1.5, 3, 3)
      }

      if (pointer.active) {
        ctx!.globalAlpha = intro * 0.4
        ctx!.setLineDash([2, 4])
        ctx!.beginPath()
        for (const node of nodes) {
          const d = Math.hypot(node.x - pointer.x, node.y - pointer.y)
          if (d > CURSOR_RADIUS) continue
          ctx!.moveTo(pointer.x, pointer.y)
          ctx!.lineTo(node.x, node.y)
        }
        ctx!.stroke()
        ctx!.setLineDash([])
      }
      ctx!.globalAlpha = 1
    }

    function update(dt: number) {
      for (const packet of packets) {
        packet.s += packet.speed * dt
        if (packet.s >= edgeLength(nodes[packet.from], nodes[packet.to])) {
          nodes[packet.to].heat = 1
          nextHop(packet)
        }
      }
      for (const node of nodes) {
        node.heat *= Math.exp(-dt * 2.2)
        if (!pointer.active) continue
        const d = Math.hypot(node.x - pointer.x, node.y - pointer.y)
        if (d < CURSOR_RADIUS) node.heat = Math.max(node.heat, 0.45 * (1 - d / CURSOR_RADIUS))
      }
    }

    function loop(time: number) {
      if (!born) born = time
      const dt = Math.min((time - (last || time)) / 1000, 0.1)
      last = time
      update(dt)
      render(Math.min((time - born) / 700, 1))
      frame = requestAnimationFrame(loop)
    }

    function start() { if (!frame && visible && !document.hidden && !reduced) { last = 0; frame = requestAnimationFrame(loop) } }
    function stop() { cancelAnimationFrame(frame); frame = 0 }

    layout()
    if (reduced) render(1)
    else start()

    const resize = new ResizeObserver(() => { layout(); if (reduced) render(1) })
    resize.observe(canvas)
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else stop() })
    io.observe(canvas)
    const onVisibility = () => { if (document.hidden) stop(); else start() }
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = event.pointerType === 'mouse' && pointer.y >= 0 && pointer.y <= rect.height
    }
    const onLeave = () => { pointer.active = false }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      stop()
      resize.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} />
}
