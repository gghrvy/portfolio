'use client'

import { useRef, useEffect } from 'react'
import { Mesh } from 'three'
import gsap from 'gsap'
import { useTheaterStore } from '@/store/theaterStore'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const CURTAIN_W = 7
const CURTAIN_H = 10
const CURTAIN_Y = 5.5
const CURTAIN_Z = -15.5
const CLOSED_X = 0
const OPEN_X = 8.5

export default function Curtains() {
  const leftRef = useRef<Mesh>(null)
  const rightRef = useRef<Mesh>(null)
  const activeSection = useTheaterStore(s => s.activeSection)
  const reduced = useReducedMotion()

  useEffect(() => {
    const open = activeSection !== 'lobby'
    const leftX  = open ?  OPEN_X : CLOSED_X
    const rightX = open ? -OPEN_X : CLOSED_X

    if (reduced) {
      if (leftRef.current)  leftRef.current.position.x = leftX
      if (rightRef.current) rightRef.current.position.x = rightX
      return
    }

    gsap.to(leftRef.current!.position,  { x: leftX,  duration: 1.4, ease: 'power3.inOut' })
    gsap.to(rightRef.current!.position, { x: rightX, duration: 1.4, ease: 'power3.inOut' })
  }, [activeSection, reduced])

  return (
    <>
      <mesh ref={leftRef} position={[CLOSED_X, CURTAIN_Y, CURTAIN_Z]}>
        <planeGeometry args={[CURTAIN_W, CURTAIN_H, 1, 12]} />
        <meshStandardMaterial
          color="#5a0a0a"
          roughness={0.95}
          metalness={0}
          emissive="#200000"
          emissiveIntensity={0.1}
          side={2}
        />
      </mesh>

      <mesh ref={rightRef} position={[-CLOSED_X, CURTAIN_Y, CURTAIN_Z]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[CURTAIN_W, CURTAIN_H, 1, 12]} />
        <meshStandardMaterial
          color="#5a0a0a"
          roughness={0.95}
          metalness={0}
          emissive="#200000"
          emissiveIntensity={0.1}
          side={2}
        />
      </mesh>
    </>
  )
}
