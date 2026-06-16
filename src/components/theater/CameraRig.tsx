import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import gsap from 'gsap'
import { useTheaterStore } from '@/store/theaterStore'
import { CAMERA_SHOTS, SECTION_TO_SHOT } from '@/lib/theater/cameraShots'
import { EASE, DUR } from '@/lib/theater/easing'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Quadratic bezier between camera positions — the perpendicular offset of the
// midpoint gives section transitions a gentle arc instead of a straight line.
function quadBezier(a: Vector3, m: Vector3, b: Vector3, t: number, out: Vector3) {
  const u = 1 - t
  out.set(
    u * u * a.x + 2 * u * t * m.x + t * t * b.x,
    u * u * a.y + 2 * u * t * m.y + t * t * b.y,
    u * u * a.z + 2 * u * t * m.z + t * t * b.z,
  )
}

export default function CameraRig() {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const activeSection = useTheaterStore(s => s.activeSection)
  const setTransitioning = useTheaterStore(s => s.setTransitioning)
  const isTransitioning = useTheaterStore(s => s.isTransitioning)
  const mode = useTheaterStore(s => s.mode)
  const reduced = useReducedMotion()
  const tweensRef = useRef<gsap.core.Tween[]>([])
  const isFirstMount = useRef(true)
  const driftPrev = useRef({ x: 0, y: 0 })

  // Hand the camera over to Trailer/TicketBooth during those modes
  useEffect(() => {
    if (controlsRef.current) controlsRef.current.enabled = mode === 'normal'
  }, [mode])

  // Entrance dolly: start behind/above the lobby shot and glide in.
  // Skipped on first visits — TicketBooth owns the camera in ticket mode.
  useEffect(() => {
    const shot = CAMERA_SHOTS['LOBBY']
    if (controlsRef.current) {
      controlsRef.current.target.set(...shot.target)
      controlsRef.current.update()
    }
    if (useTheaterStore.getState().mode === 'ticket') return
    if (reduced) {
      camera.position.set(...shot.position)
      return
    }
    camera.position.set(shot.position[0], shot.position[1] + 0.8, shot.position[2] + 5)
    const t = gsap.to(camera.position, {
      x: shot.position[0], y: shot.position[1], z: shot.position[2],
      duration: 2.4, delay: 0.6, ease: EASE.enter,
    })
    return () => { t.kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera])

  // Idle drift — the frame never freezes. Applied as a frame-to-frame delta so
  // it composes with OrbitControls without fighting it.
  useFrame(({ clock }) => {
    if (reduced || isTransitioning || mode !== 'normal') return
    const t = clock.elapsedTime
    const x = Math.sin(t * 0.23) * 0.05
    const y = Math.sin(t * 0.31 + 1.7) * 0.03
    camera.position.x += x - driftPrev.current.x
    camera.position.y += y - driftPrev.current.y
    driftPrev.current = { x, y }
  })

  // Arced tween when activeSection changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    if (useTheaterStore.getState().mode !== 'normal') return
    const shot = CAMERA_SHOTS[SECTION_TO_SHOT[activeSection]]
    const controls = controlsRef.current
    if (!controls) return

    tweensRef.current.forEach(t => t.kill())

    if (reduced) {
      camera.position.set(...shot.position)
      controls.target.set(...shot.target)
      controls.update()
      const el = document.getElementById('theater-announcer')
      if (el) el.textContent = activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
      return
    }

    setTransitioning(true)
    controls.enabled = false

    const from = camera.position.clone()
    const to = new Vector3(...shot.position)
    // Arc waypoint: midpoint pushed sideways (perpendicular in XZ) + slightly up
    const mid = from.clone().add(to).multiplyScalar(0.5)
    const dir = to.clone().sub(from)
    const perp = new Vector3(-dir.z, 0, dir.x).normalize()
    mid.add(perp.multiplyScalar(dir.length() * 0.12)).add(new Vector3(0, dir.length() * 0.04, 0))

    const tgtObj = { x: controls.target.x, y: controls.target.y, z: controls.target.z }
    const prog = { t: 0 }
    const pos = new Vector3()

    const finishTransition = () => {
      setTransitioning(false)
      controls.enabled = true
      const el = document.getElementById('theater-announcer')
      if (el) el.textContent = activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
    }
    const safetyTimer = setTimeout(finishTransition, 1800)

    const t1 = gsap.to(prog, {
      t: 1, duration: DUR.transition, ease: EASE.camera,
      onUpdate: () => {
        quadBezier(from, mid, to, prog.t, pos)
        camera.position.copy(pos)
      },
    })
    const t2 = gsap.to(tgtObj, {
      x: shot.target[0], y: shot.target[1], z: shot.target[2],
      duration: DUR.transition, ease: EASE.camera,
      onUpdate: () => {
        controls.target.set(tgtObj.x, tgtObj.y, tgtObj.z)
        controls.update()
      },
      onComplete: () => {
        clearTimeout(safetyTimer)
        finishTransition()
      },
    })
    tweensRef.current = [t1, t2]
  }, [activeSection]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      dampingFactor={0.08}
      enableDamping
    />
  )
}
