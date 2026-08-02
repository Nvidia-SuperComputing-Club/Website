import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ==========================================
// GLTF LOADER WITH ERROR BOUNDARY FALLBACK
// ==========================================
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("GLTF model loading failed. Using premium procedural model instead.", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const LOAD_3D_MODEL = import.meta.env.VITE_LOAD_3D_MODEL === 'true';

// 1. Attempts to load the physical GLTF file
function DGXGLTFModel() {
  const { scene } = useGLTF('/models/dgx-h100.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
  
  // Traverse and apply PBR properties & emissive glow to the GLTF model
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      
      // Enhance material characteristics if PBR is used
      if (child.material) {
        child.material.roughness = Math.min(child.material.roughness, 0.3);
        child.material.metalness = Math.max(child.material.metalness, 0.8);
        
        // Match base color specs if not textured
        if (!child.material.map) {
          child.material.color.set('#1A1A1A');
        }
        
        // Turn on NVIDIA green emission for glowing components
        if (child.name.toLowerCase().includes('glow') || child.name.toLowerCase().includes('led')) {
          child.material.emissive = new THREE.Color('#76B900');
          child.material.emissiveIntensity = 2.0;
        }
      }
    }
  });

  return <primitive object={scene} scale={1.2} position={[0, 0, 0]} />;
}

// 2. Procedural DGX H100 chassis rendering if GLB file is absent
function DGXProceduralModel() {
  const frontFansRef = useRef([]);
  
  // Dynamic rotation for procedural cooling fans
  useFrame((state) => {
    frontFansRef.current.forEach((fan) => {
      if (fan) {
        fan.rotation.z += 0.12;
      }
    });
  });

  return (
    <group scale={1.3}>
      {/* 3D Main Server Chassis Box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2, 1.6, 2.0]} />
        <meshStandardMaterial 
          color="#1A1A1A" 
          roughness={0.2} 
          metalness={0.95} 
        />
      </mesh>

      {/* Front Face Ventilation Panel */}
      <mesh position={[0, 0, 1.01]} castShadow>
        <boxGeometry args={[3.1, 1.5, 0.04]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Glowing NVIDIA Green Line Accents */}
      <mesh position={[0, 0.7, 1.035]}>
        <boxGeometry args={[2.8, 0.015, 0.02]} />
        <meshBasicMaterial color="#76B900" />
      </mesh>
      <mesh position={[0, -0.7, 1.035]}>
        <boxGeometry args={[2.8, 0.015, 0.02]} />
        <meshBasicMaterial color="#76B900" />
      </mesh>

      {/* Front Panel Grid of Rotating Fans */}
      {[-1.1, -0.55, 0, 0.55, 1.1].map((xOffset, idx) => (
        <group key={idx} position={[xOffset, 0, 1.03]}>
          {/* Outer Fan Ring Accent */}
          <mesh>
            <ringGeometry args={[0.22, 0.24, 32]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Inner Glowing Vent Circle */}
          <mesh position={[0, 0, -0.01]}>
            <circleGeometry args={[0.22, 32]} />
            <meshBasicMaterial color="#76B900" toneMapped={false} />
          </mesh>

          {/* Rotating Fan Blades */}
          <group ref={(el) => (frontFansRef.current[idx] = el)}>
            {[0, 45, 90, 135].map((angle) => (
              <mesh key={angle} rotation={[0, 0, (angle * Math.PI) / 180]}>
                <boxGeometry args={[0.42, 0.06, 0.01]} />
                <meshStandardMaterial color="#111" roughness={0.6} />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* Metallic Server Handles */}
      <mesh position={[-1.52, 0, 1.04]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.04, 0.8, 0.12]} />
        <meshStandardMaterial color="#888" roughness={0.1} metalness={1.0} />
      </mesh>
      <mesh position={[1.52, 0, 1.04]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.04, 0.8, 0.12]} />
        <meshStandardMaterial color="#888" roughness={0.1} metalness={1.0} />
      </mesh>

      {/* Detailed Status Indicator Lights */}
      {[-0.9, -0.3, 0.3, 0.9].map((xVal, index) => (
        <group key={index} position={[xVal, 0.55, 1.04]}>
          {/* LED 1 */}
          <mesh position={[-0.08, 0, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color={index % 3 === 0 ? "#FF3333" : "#76B900"} toneMapped={false} />
          </mesh>
          {/* LED 2 */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="#76B900" toneMapped={false} />
          </mesh>
          {/* LED 3 */}
          <mesh position={[0.08, 0, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="#E6B800" toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Top Heat Sink Vents & Ridges */}
      <group position={[0, 0.81, 0]}>
        {[-1.2, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1.2].map((zVal, index) => (
          <mesh key={index} position={[0, 0, zVal]}>
            <boxGeometry args={[2.8, 0.02, 0.04]} />
            <meshStandardMaterial color="#0D0D0D" roughness={0.3} metalness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// 3. Combined export with layout constraints, auto-rotation and mouse-tracking parallax
export default function DGXModel({ isMobile = false }) {
  const groupRef = useRef();

  // Smooth mouse tracking and continuous Y auto-rotation
  useFrame((state) => {
    if (groupRef.current) {
      // 1. Continuous rotation target
      const baseRotationY = state.clock.getElapsedTime() * 0.08;
      
      // 2. Parallax offsets based on cursor pointer (-1 to +1 range)
      const mouseParallaxX = state.pointer.x * 0.35;
      const mouseParallaxY = -state.pointer.y * 0.25;

      // 3. Smooth interpolation (lerp)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        baseRotationY + mouseParallaxX,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseParallaxY,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <ModelErrorBoundary fallback={<DGXProceduralModel />}>
        {LOAD_3D_MODEL ? <DGXGLTFModel /> : <DGXProceduralModel />}
      </ModelErrorBoundary>
    </group>
  );
}
