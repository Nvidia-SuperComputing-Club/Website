import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import DGXModel from './DGXModel';
import ParticleField from './ParticleField';
import * as THREE from 'three';

// 1. Sleek wireframe loading placeholder used during Suspense loading
function LoadingPlaceholder() {
  const meshRef = useRef();
  
  // Rotate wireframe placeholder
  useEffect(() => {
    let animFrame;
    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.01;
        meshRef.current.rotation.x += 0.005;
      }
      animFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <group>
      {/* Outer wireframe outline matching DGX size */}
      <mesh ref={meshRef}>
        <boxGeometry args={[3.2, 1.6, 2.0]} />
        <meshBasicMaterial color="#76B900" wireframe transparent opacity={0.25} />
      </mesh>
      {/* Loading indicator glow */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#76B900" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// 2. Main Hero Scene Canvas
export default function HeroScene({ isMobile = false }) {
  const containerRef = useRef();
  const [isIntersecting, setIsIntersecting] = useState(true);

  // Intersection Observer to pause rendering when component is off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: null, // Viewport
        rootMargin: '100px', // Start rendering 100px before entering viewport
        threshold: 0.01 // Trigger as soon as 1% is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[350px] md:min-h-[500px] relative select-none"
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto none auto 500px' }}
    >
      {/* R3F Canvas - Pause frameloop when off-screen */}
      <Canvas
        frameloop={isIntersecting ? 'always' : 'never'}
        camera={{ position: [0, 0.4, isMobile ? 5.2 : 4.4], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        {/* Environment Lights */}
        <ambientLight intensity={0.3} />
        
        {/* Crisp directional key light */}
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Green spot light highlighting server details */}
        <spotLight 
          position={[-3, 4, -2]} 
          intensity={0.8} 
          angle={0.18} 
          penumbra={0.6} 
          color="#76B900" 
        />

        {/* Ambient point light behind the model */}
        <pointLight position={[0, -1, -2]} intensity={0.5} color="#76B900" />

        {/* WebGL Custom Shader Particles */}
        <ParticleField />

        {/* DGX H100 Model wrapped in standard Suspense */}
        <Suspense fallback={<LoadingPlaceholder />}>
          <DGXModel isMobile={isMobile} />
        </Suspense>

        {/* Disables user OrbitControls but allows setting standard constraints */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={false} 
        />

        {/* Post-processing Bloom & Vignette */}
        <EffectComposer disableNormalPass>
          <Bloom 
            threshold={0.6} 
            luminanceThreshold={0.6}
            intensity={0.4} 
            mipmapBlur
          />
          <Vignette darkness={0.5} offset={0.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
