'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Icosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth) * 2 - 1);
      setMouseY(-(e.clientY / window.innerHeight) * 2 + 1);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      meshRef.current.position.x = mouseX * 0.002;
      meshRef.current.position.y = mouseY * 0.002;
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 4]} />
        <meshStandardMaterial
          color="#1a1a2e"
          wireframe={true}
          emissive="#4f8ef7"
          emissiveIntensity={0.3}
        />
      </mesh>
      <pointLight position={[5, 5, 5]} color="#4f8ef7" intensity={2} />
    </>
  );
}

export default function HeroMesh() {
  return (
    <Canvas className="w-full h-full" camera={{ position: [0, 0, 3] }}>
      <Icosahedron />
    </Canvas>
  );
}
