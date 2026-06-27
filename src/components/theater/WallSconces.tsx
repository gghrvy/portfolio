'use client'

const ROOM_HALF_W = 11
const SCONCE_Y = 7.8
const Z_POSITIONS = [1.5, -7.5, -13.5]

function Sconce({ x, z, dir }: { x: number; z: number; dir: 1 | -1 }) {
  return (
    <group position={[x, SCONCE_Y, z]}>
      {/* Backplate */}
      <mesh>
        <boxGeometry args={[0.06, 0.30, 0.24]} />
        <meshStandardMaterial color="#6a5040" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Horizontal arm */}
      <mesh position={[dir * 0.22, 0.06, 0]}>
        <boxGeometry args={[0.4, 0.04, 0.04]} />
        <meshStandardMaterial color="#9a7a58" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Globe shade */}
      <mesh position={[dir * 0.45, -0.06, 0]}>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial
          color="#120c04"
          emissive="#ffb050"
          emissiveIntensity={5.0}
          roughness={0.5}
        />
      </mesh>
      <pointLight
        position={[dir * 0.45, -0.06, 0]}
        color="#ff9030"
        intensity={0.7}
        distance={5}
        decay={2}
      />
    </group>
  )
}

export default function WallSconces() {
  return (
    <group>
      {Z_POSITIONS.map(z => (
        <group key={z}>
          <Sconce x={-(ROOM_HALF_W - 0.04)} z={z} dir={1} />
          <Sconce x={ROOM_HALF_W - 0.04} z={z} dir={-1} />
        </group>
      ))}
    </group>
  )
}
