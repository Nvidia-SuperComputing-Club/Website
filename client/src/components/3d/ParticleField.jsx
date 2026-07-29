import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform float uSizeScale;
  
  attribute float aSize;
  attribute float aColorMix;
  
  varying float vColorMix;
  varying float vAlpha;

  // Classic hash/sine-based 3D noise for gentle organic drift
  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  
  float noise(in vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    return mix(
      mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
          mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
      mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
          mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z
    );
  }

  void main() {
    vColorMix = aColorMix;
    
    vec3 pos = position;

    // Gentle upward drift: speed varies based on individual particle indices
    float speed = 0.4 + hash(position.x * 13.0) * 0.4;
    pos.y += uTime * speed * 0.5;

    // Wrap particles vertically between Y = -6.0 and Y = 6.0
    pos.y = mod(pos.y + 6.0, 12.0) - 6.0;

    // Inject Perlin-like noise wave oscillations in X and Z axes
    float noiseTime = uTime * 0.15;
    pos.x += (noise(pos * 0.4 + vec3(noiseTime)) - 0.5) * 1.5;
    pos.z += (noise(pos * 0.4 + vec3(noiseTime + 45.0)) - 0.5) * 1.5;

    // Transform to model-view space
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Set particle size with proper perspective attenuation (smaller when further away)
    gl_PointSize = aSize * (400.0 / -mvPosition.z) * uSizeScale;

    // Subtle fadeout near the top/bottom boundaries of the viewport scene bounds
    float fadeEdge = smoothstep(-6.0, -4.5, pos.y) * smoothstep(6.0, 4.5, pos.y);
    vAlpha = fadeEdge;
  }
`;

const fragmentShader = `
  varying float vColorMix;
  varying float vAlpha;

  void main() {
    // Generate glowing round circular shapes instead of default squares
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) {
      discard;
    }
    
    // Smooth glow decay gradient
    float strength = smoothstep(0.5, 0.08, dist);

    // Dynamic color mix: NVIDIA Green (#76B900) vs Pure White
    vec3 nvidiaGreen = vec3(0.463, 0.725, 0.0); // #76B900 in normalized RGB
    vec3 white = vec3(1.0, 1.0, 1.0);
    vec3 mixedColor = mix(nvidiaGreen, white, vColorMix);

    // Apply color and soft gradient transparency
    gl_FragColor = vec4(mixedColor, strength * vAlpha * 0.8);
  }
`;

export default function ParticleField() {
  const pointsRef = useRef();
  const materialRef = useRef();
  const particleCount = 2000;

  // Pre-generate positions and custom attributes
  const { positions, sizes, colorMixes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colorMixes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spread positions uniformly across a 3D box region
      positions[i * 3] = (Math.random() - 0.5) * 10;     // X: -5 to +5
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12; // Y: -6 to +6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;  // Z: -4 to +4

      // Random particle sizes matching requested range: 0.02 - 0.08
      sizes[i] = 0.02 + Math.random() * 0.06;

      // Color distribution: ~70% NVIDIA Green, ~30% White
      colorMixes[i] = Math.random() > 0.7 ? Math.random() * 0.4 + 0.6 : Math.random() * 0.2;
    }

    return { positions, sizes, colorMixes };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSizeScale: { value: 1.0 }
  }), []);

  // Update time uniform in render loop
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aColorMix"
          args={[colorMixes, 1]}
          count={particleCount}
          array={colorMixes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
