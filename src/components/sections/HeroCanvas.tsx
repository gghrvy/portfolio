'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMousePosition } from '@/hooks/useMousePosition';
import * as THREE from 'three';

function IcosahedronMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const mouse = useMousePosition();

  useFrame(() => {
    if (!meshRef.current || !wireRef.current) return;

    meshRef.current.rotation.x += 0.0008;
    meshRef.current.rotation.y += 0.0015;
    wireRef.current.rotation.x += 0.0008;
    wireRef.current.rotation.y += 0.0015;

    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      mouse.x * 0.8,
      0.03
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      mouse.y * 0.5,
      0.03
    );
    wireRef.current.position.x = meshRef.current.position.x;
    wireRef.current.position.y = meshRef.current.position.y;
  });

  return (
    <>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial color="#0d1528" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[2.01, 1]} />
        <meshBasicMaterial color="#4f8ef7" wireframe transparent opacity={0.15} />
      </mesh>
    </>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} color="#4f8ef7" intensity={4} />
      <pointLight position={[-3, -3, 3]} color="#7c3aed" intensity={2} />
      <IcosahedronMesh />
    </Canvas>
  );
}
