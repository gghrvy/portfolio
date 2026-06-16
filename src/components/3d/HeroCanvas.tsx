'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── shared input state ── */
const mouse = { x: 0, y: 0 };
let scrollY = 0;

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
}

/* ── scroll progress helper ── */
function getScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? scrollY / max : 0;
}

/* ─────────────────────────────────────────────
   MORPHING CORE — the hero piece that breathes
───────────────────────────────────────────── */
function MorphingCore() {
  const groupRef = useRef<THREE.Group>(null);
  const solidRef = useRef<THREE.Mesh>(null);
  const wireRef  = useRef<THREE.Mesh>(null);

  // Shared geometry with stored original positions
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 3), []);
  const origPos = useMemo(() => {
    return Float32Array.from(geo.attributes.position.array as Float32Array);
  }, [geo]);

  useFrame(({ clock }) => {
    const t   = clock.getElapsedTime();
    const p   = getScrollProgress();
    const pos = geo.attributes.position;

    // Vertex displacement — the mesh breathes and pulses
    for (let i = 0; i < pos.count; i++) {
      const ox = origPos[i * 3];
      const oy = origPos[i * 3 + 1];
      const oz = origPos[i * 3 + 2];
      const noise =
        Math.sin(ox * 2.8 + t * 0.9) *
        Math.cos(oy * 2.8 + t * 0.7) *
        Math.sin(oz * 2.0 + t * 1.1) * 0.22;
      pos.setXYZ(i, ox + ox * noise, oy + oy * noise, oz + oz * noise);
    }
    pos.needsUpdate = true;

    if (!groupRef.current) return;

    // Slow spin + gentle float
    groupRef.current.rotation.y += 0.004;
    groupRef.current.rotation.x += 0.0015;
    groupRef.current.position.y = 0.3 + Math.sin(t * 0.35) * 0.14;

    // Mouse parallax
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      2.2 + mouse.x * 0.18,
      0.04
    );

    // Scroll: drift toward viewer and shift right as page scrolls
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      0 + p * 4,
      0.03
    );

    // Pulse scale on scroll
    const scale = 1.6 + Math.sin(t * 0.6) * 0.04 + p * 0.4;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef} position={[2.2, 0.3, 0]} scale={1.6}>
      {/* Solid dark core */}
      <mesh ref={solidRef} geometry={geo}>
        <meshStandardMaterial color="#060d1f" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Wireframe skin — glows blue */}
      <mesh ref={wireRef} geometry={geo}>
        <meshBasicMaterial color="#4f8ef7" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   ORBITING SATELLITES
───────────────────────────────────────────── */
type SatConfig = {
  position: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
  geometry: 'ico' | 'oct' | 'tet';
  wireOnly?: boolean;
};

const SATELLITES: SatConfig[] = [
  { position: [-3.8, 2.2, -2],  scale: 0.9,  speed: 0.25, phase: 1.2, geometry: 'ico', wireOnly: true },
  { position: [4.5,  2.6, -3],  scale: 0.65, speed: 0.3,  phase: 0.5, geometry: 'oct' },
  { position: [-4.2,-2.4, -2],  scale: 0.8,  speed: 0.22, phase: 2.1, geometry: 'ico', wireOnly: true },
  { position: [5.2, -0.8, -4],  scale: 1.1,  speed: 0.15, phase: 0.8, geometry: 'oct' },
  { position: [0.5,  3.2, -3],  scale: 0.55, speed: 0.35, phase: 1.7, geometry: 'tet' },
  { position: [2.8, -3.0, -3],  scale: 0.7,  speed: 0.28, phase: 3.0, geometry: 'ico', wireOnly: true },
  { position: [-5.5, 0.5, -5],  scale: 1.3,  speed: 0.12, phase: 0.3, geometry: 'oct' },
  { position: [-2.0,-3.4, -1],  scale: 0.45, speed: 0.4,  phase: 2.5, geometry: 'tet' },
];

function Satellite({ cfg }: { cfg: SatConfig }) {
  const groupRef = useRef<THREE.Group>(null);

  const geo = useMemo(() => {
    switch (cfg.geometry) {
      case 'ico': return new THREE.IcosahedronGeometry(1, 1);
      case 'oct': return new THREE.OctahedronGeometry(1, 0);
      case 'tet': return new THREE.TetrahedronGeometry(1, 0);
    }
  }, [cfg.geometry]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p = getScrollProgress();
    if (!groupRef.current) return;

    groupRef.current.rotation.x = cfg.phase + t * cfg.speed * 0.6;
    groupRef.current.rotation.y = cfg.phase + t * cfg.speed;

    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      cfg.position[1] + Math.sin(t * 0.4 + cfg.phase) * 0.15 - p * cfg.speed * 5,
      0.04
    );
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      cfg.position[0] + mouse.x * (0.06 + cfg.scale * 0.04) + p * Math.sin(cfg.phase) * 2,
      0.03
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      cfg.position[2] + p * cfg.speed * 4,
      0.03
    );
  });

  return (
    <group ref={groupRef} position={cfg.position} scale={cfg.scale}>
      {!cfg.wireOnly && (
        <mesh geometry={geo}>
          <meshStandardMaterial color="#060d1f" metalness={0.95} roughness={0.05} />
        </mesh>
      )}
      <mesh geometry={geo}>
        <meshBasicMaterial
          color="#4f8ef7"
          wireframe
          transparent
          opacity={cfg.wireOnly ? 0.22 : 0.13}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   PARTICLE FIELD
───────────────────────────────────────────── */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 380;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const p = getScrollProgress();
    ref.current.rotation.y += 0.0003;
    ref.current.rotation.x = p * 0.3;
    // Subtle breathing
    ref.current.scale.setScalar(1 + Math.sin(t * 0.2) * 0.02 + p * 0.15);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial color="#4f8ef7" size={0.022} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ─────────────────────────────────────────────
   SCENE — CatmullRom curve camera flythrough
───────────────────────────────────────────── */

// Camera travels along this spline as user scrolls 0→1
const CAM_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,    0,    7),    // hero
  new THREE.Vector3(2,    0.8,  6.5),  // about
  new THREE.Vector3(-1.5, 1.2,  6),    // services
  new THREE.Vector3(0.5, -1,    5.5),  // projects
  new THREE.Vector3(-2,   0.5,  6.2),  // contact
  new THREE.Vector3(1,    1,    7),    // footer
], false, 'catmullrom', 0.5);

// Look-at travels along a slightly offset curve so camera always has interesting angle
const LOOK_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,    0,    0),
  new THREE.Vector3(-0.5, 0.2,  0),
  new THREE.Vector3(1,   -0.3,  0),
  new THREE.Vector3(0.3,  0.8,  0),
  new THREE.Vector3(-0.5, 0,    0),
  new THREE.Vector3(0,    0.2,  0),
], false, 'catmullrom', 0.5);

function Scene() {
  const camTarget  = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const camPos     = useRef(new THREE.Vector3(0, 0, 7));

  useFrame(({ camera }) => {
    const p = Math.min(Math.max(getScrollProgress(), 0), 1);

    CAM_CURVE.getPoint(p, camTarget.current);
    LOOK_CURVE.getPoint(p, lookTarget.current);

    // Mouse micro-offset on top of curve
    camTarget.current.x += mouse.x * 0.4;
    camTarget.current.y += mouse.y * 0.25;

    // Smooth follow
    camPos.current.lerp(camTarget.current, 0.028);
    camera.position.copy(camPos.current);
    camera.lookAt(lookTarget.current);
  });

  return (
    <>
      <fog attach="fog" args={['#050508', 14, 32]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 4, 4]}   color="#4f8ef7" intensity={12} distance={24} />
      <pointLight position={[-6, -4, 2]} color="#7c3aed" intensity={6}  distance={20} />
      <pointLight position={[0,  2, 8]}  color="#ffffff"  intensity={2}  distance={16} />

      <MorphingCore />
      {SATELLITES.map((cfg, i) => <Satellite key={i} cfg={cfg} />)}
      <Particles />
    </>
  );
}

export default function HeroCanvas() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
