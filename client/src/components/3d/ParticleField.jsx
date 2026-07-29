import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// WebGL Particle Field matching UI-DESIGN.md spec:
// - 2000 particles, size 0.02-0.08, nvidia-green + white, gentle drift upward

const PARTICLE_COUNT = 2000

export default function ParticleField() {
  const meshRef = useRef()
  const timeRef = useRef(0)

  // Generate random positions and attributes once
  const { positions, sizes, colors, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)

    // NVIDIA green: rgb(0.463, 0.725, 0)  white: rgb(1,1,1)
    const nvidiaColor = new THREE.Color('#76B900')
    const whiteColor = new THREE.Color('#FFFFFF')

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      // Spread in a wide box
      positions[i3 + 0] = (Math.random() - 0.5) * 30
      positions[i3 + 1] = (Math.random() - 0.5) * 20
      positions[i3 + 2] = (Math.random() - 0.5) * 15

      sizes[i] = 0.02 + Math.random() * 0.06 // 0.02–0.08

      // Mix color between nvidia-green and white
      const t = Math.random()
      const mixed = nvidiaColor.clone().lerp(whiteColor, t * 0.3)
      colors[i3 + 0] = mixed.r
      colors[i3 + 1] = mixed.g
      colors[i3 + 2] = mixed.b

      // Gentle upward drift + noise
      velocities[i3 + 0] = (Math.random() - 0.5) * 0.002
      velocities[i3 + 1] = 0.001 + Math.random() * 0.003  // 0.1–0.3 units/s scaled
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.001
    }
    return { positions, sizes, colors, velocities }
  }, [])

  // Animate particles upward; respawn at bottom when reaching top
  useFrame((_, delta) => {
    if (!meshRef.current) return
    timeRef.current += delta

    const posArray = meshRef.current.geometry.attributes.position.array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      posArray[i3 + 0] += velocities[i3 + 0]
      posArray[i3 + 1] += velocities[i3 + 1]
      posArray[i3 + 2] += velocities[i3 + 2]

      // Respawn when out of bounds
      if (posArray[i3 + 1] > 10) {
        posArray[i3 + 1] = -10
      }
      if (Math.abs(posArray[i3 + 0]) > 15) posArray[i3 + 0] *= -0.9
      if (Math.abs(posArray[i3 + 2]) > 7.5) posArray[i3 + 2] *= -0.9
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
