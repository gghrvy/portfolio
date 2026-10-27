'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import * as THREE from 'three'

type Cloud = { geometry: THREE.BufferGeometry }
const random = (seed: number) => { const value = Math.sin(seed * 127.1) * 43758.5453123; return value - Math.floor(value) }
const gaussian = (value: number, center: number, spread: number) => Math.exp(-((value - center) ** 2) / spread)

function makeFace(count: number): Cloud {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3), origins = new Float32Array(count * 3), colors = new Float32Array(count * 3), sizes = new Float32Array(count), seeds = new Float32Array(count)
  for (let i = 0; i < count; i += 1) {
    const theta = random(i + 11) * Math.PI * 2, radius = Math.sqrt(random(i + 29)), y = Math.sin(theta) * 1.18 * radius - .02
    const x = Math.cos(theta) * .78 * radius * (y > .38 ? 1 - (y - .38) * .43 : 1)
    const surface = Math.max(0, 1 - (x / .78) ** 2 - ((y + .02) / 1.18) ** 2)
    const nose = gaussian(x, 0, .012) * gaussian(y, .13, .14) * .36
    const cheek = (gaussian(x, -.38, .08) + gaussian(x, .38, .08)) * gaussian(y, .2, .2) * .11
    const sockets = (gaussian(x, -.28, .014) + gaussian(x, .28, .014)) * gaussian(y, -.13, .012) * .16
    const feature = Math.max(gaussian(x, -.28, .008) * gaussian(y, -.13, .008), gaussian(x, .28, .008) * gaussian(y, -.13, .008), gaussian(x, 0, .025) * gaussian(y, .43, .012), gaussian(Math.abs(x), .71, .012) * gaussian(y, .1, .45))
    positions.set([x, -y, Math.sqrt(surface) * .52 + nose + cheek - sockets + (random(i + 71) - .5) * .05], i * 3)
    origins.set([(random(i + 101) - .5) * 4.6, (random(i + 131) - .5) * 4.2, (random(i + 151) - .5) * 2.4], i * 3)
    colors.set([.43 + feature * .4, .68 + feature * .25, .65 + random(i + 89) * .3], i * 3)
    sizes[i] = .72 + random(i + 171) * 1.3 + feature * 1.65; seeds[i] = random(i + 191)
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geometry.setAttribute('aOrigin', new THREE.BufferAttribute(origins, 3)); geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1)); geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1)); geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return { geometry }
}

function makeField(count: number): Cloud {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3), origins = new Float32Array(count * 3), colors = new Float32Array(count * 3), sizes = new Float32Array(count), seeds = new Float32Array(count)
  for (let i = 0; i < count; i += 1) {
    const angle = random(i + 301) * Math.PI * 2, radius = 1 + random(i + 331) * 1.18, x = Math.cos(angle) * radius * (.7 + random(i + 341) * .5), y = Math.sin(angle) * radius * 1.06, z = (random(i + 371) - .5) * 1.8, warm = random(i + 401) > .94
    positions.set([x, y, z], i * 3); origins.set([x * 1.55, y * 1.45, z * 1.75], i * 3); colors.set(warm ? [.92, .46, .34] : [.34 + random(i + 421) * .24, .56 + random(i + 431) * .28, .95], i * 3); sizes[i] = .65 + random(i + 461) * 2.4; seeds[i] = random(i + 491)
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geometry.setAttribute('aOrigin', new THREE.BufferAttribute(origins, 3)); geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1)); geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1)); geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return { geometry }
}

function makeLandmarks(count: number): Cloud {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3), origins = new Float32Array(count * 3), colors = new Float32Array(count * 3), sizes = new Float32Array(count), seeds = new Float32Array(count)
  for (let i = 0; i < count; i += 1) {
    const mode = i % 4, t = random(i + 901) * Math.PI * 2, side = i % 2 ? -1 : 1
    let x = 0, y = 0, z = .56
    if (mode === 0) { x = side * .28 + Math.cos(t) * .135; y = -.14 + Math.sin(t) * .052 }
    if (mode === 1) { const u = random(i + 911); x = side * (.12 + u * .25); y = -.27 - Math.sin(u * Math.PI) * .055 }
    if (mode === 2) { x = Math.cos(t) * .18; y = .42 + Math.sin(t) * .052; z = .49 }
    if (mode === 3) { const angle = random(i + 921) * Math.PI * 2; const vertical = Math.sin(angle); x = Math.cos(angle) * .79 * (vertical > .38 ? 1 - (vertical - .38) * .43 : 1); y = vertical * 1.18 - .02; z = .12 }
    positions.set([x, -y, z], i * 3); origins.set([(random(i + 931) - .5) * 3.6, (random(i + 941) - .5) * 3.5, (random(i + 951) - .5) * 1.6], i * 3); colors.set([.76, .88, 1], i * 3); sizes[i] = 1.1 + random(i + 961) * 1.25; seeds[i] = random(i + 971)
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geometry.setAttribute('aOrigin', new THREE.BufferAttribute(origins, 3)); geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1)); geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1)); geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return { geometry }
}

const vertexShader = `uniform float uTime; uniform float uForm; uniform float uField; uniform float uPointScale; attribute vec3 aOrigin; attribute float aSize; attribute float aSeed; varying vec3 vColor; varying float vAlpha; void main() { float form = smoothstep(.02,.92,uForm); vec3 p = mix(aOrigin,position,form); float amount = mix(.075,.006,uField); p += vec3(sin(uTime*(.42+aSeed)+p.y*2.7),cos(uTime*(.36+aSeed)+p.x*3.1),sin(uTime*(.28+aSeed)+p.y*2.3))*amount*mix(1.,.32,form); vec4 viewPosition=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*viewPosition; gl_PointSize=min(9.,aSize*uPointScale*(32./-viewPosition.z)); vColor=color; vAlpha=mix(.08+aSeed*.15,.58+aSeed*.22,form)*mix(.55,1.,uField); }`
const fragmentShader = `varying vec3 vColor; varying float vAlpha; void main() { float radius=length(gl_PointCoord-vec2(.5)); float alpha=smoothstep(.5,.08,radius)*vAlpha; if(alpha<.015) discard; gl_FragColor=vec4(vColor,alpha); }`

function ParticleLayer({ cloud, field }: { cloud: Cloud; field: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uForm: { value: 0 }, uField: { value: field ? 0 : 1 }, uPointScale: { value: field ? .3 : .72 } }), [field])
  useEffect(() => { const tween = gsap.to(uniforms.uForm, { value: 1, duration: field ? 1.55 : 1.8, delay: field ? .05 : .16, ease: 'power3.out' }); return () => { tween.kill() } }, [field, uniforms])
  useFrame(({ clock }) => { if (material.current) material.current.uniforms.uTime.value = clock.getElapsedTime() })
  return <points geometry={cloud.geometry}><shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} vertexColors transparent depthWrite={false} blending={field ? THREE.AdditiveBlending : THREE.NormalBlending} /></points>
}

function Orbs() {
  const mesh = useRef<THREE.InstancedMesh>(null), dummy = useMemo(() => new THREE.Object3D(), [])
  const orbs = useMemo(() => Array.from({ length: 8 }, (_, i) => ({ angle: random(i + 701) * Math.PI * 2, radius: 1.1 + random(i + 731) * 1.15, y: (random(i + 751) - .5) * 2.65, size: .01 + random(i + 771) * .016 })), [])
  useFrame(({ clock }) => { if (!mesh.current) return; const time = clock.getElapsedTime(); orbs.forEach((orb, i) => { const angle = orb.angle + time * (.08 + i * .003); dummy.position.set(Math.cos(angle) * orb.radius, orb.y + Math.sin(time * .5 + i) * .09, Math.sin(angle) * .55); dummy.scale.setScalar(orb.size * (1 + Math.sin(time + i) * .18)); dummy.updateMatrix(); mesh.current?.setMatrixAt(i, dummy.matrix) }); mesh.current.instanceMatrix.needsUpdate = true })
  return <instancedMesh ref={mesh} args={[undefined, undefined, 8]}><sphereGeometry args={[1, 10, 10]} /><meshBasicMaterial color="#9ecbff" transparent opacity={.72} /></instancedMesh>
}

function Scene({ compact, reduced }: { compact: boolean; reduced: boolean }) {
  const group = useRef<THREE.Group>(null), face = useMemo(() => makeFace(compact ? 4800 : 11000), [compact]), landmarks = useMemo(() => makeLandmarks(compact ? 650 : 1450), [compact]), field = useMemo(() => makeField(compact ? 220 : 520), [compact])
  useEffect(() => () => { face.geometry.dispose(); landmarks.geometry.dispose(); field.geometry.dispose() }, [face, field])
  useFrame(({ clock, pointer }) => { if (!group.current || reduced) return; group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * .075, .025); group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * .035, .025); group.current.position.y = Math.sin(clock.getElapsedTime() * .45) * .025 })
  return <group ref={group} scale={compact ? .84 : 1}><ParticleLayer cloud={field} field /><ParticleLayer cloud={face} field={false} /><ParticleLayer cloud={landmarks} field={false} />{!compact && <Orbs />}</group>
}

function useMedia(query: string) { const [matches, setMatches] = useState(false); useEffect(() => { const media = window.matchMedia(query), update = () => setMatches(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update) }, [query]); return matches }
function Fallback() { return <div className="aria-fallback" aria-hidden="true"><span /><span /><span /><span /><span /></div> }

export function AriaPresence({ active = true }: { active?: boolean }) {
  const compact = useMedia('(max-width: 780px), (pointer: coarse)'), reduced = useMedia('(prefers-reduced-motion: reduce)')
  return <div className="aria-presence" aria-hidden="true"><Image src="/aria-presence-source.png" alt="" width={1254} height={1254} sizes="(max-width: 900px) 90vw, 410px" /><Canvas className="aria-particle-overlay" dpr={compact ? [1, 1.25] : [1, 1.5]} frameloop={reduced ? 'demand' : active ? 'always' : 'never'} camera={{ position: [0, 0, 5.7], fov: 29, near: .1, far: 20 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)} fallback={<Fallback />}><Scene compact={compact} reduced={reduced} /></Canvas></div>
}