import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, Float } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// 3D Spacecraft Model Component
function SpacecraftModel({ scrollProgress }) {
  const meshRef = useRef();
  const groupRef = useRef();

  // Create spacecraft geometry procedurally
  useEffect(() => {
    if (!groupRef.current) return;

    // Initial position for launch phase
    gsap.fromTo(
      groupRef.current.position,
      { x: -3, y: 0, z: 0 },
      {
        duration: 1.5,
        x: 0,
        ease: "power2.out",
      }
    );

    gsap.fromTo(
      groupRef.current.rotation,
      { z: Math.PI / 4 },
      {
        duration: 1.5,
        z: 0,
        ease: "power2.out",
      }
    );
  }, []);

  // Animate based on scroll
  useFrame((state) => {
    if (!groupRef.current) return;

    const scroll = scrollProgress;

    // Horizontal S-curve path
    groupRef.current.position.x = Math.sin(scroll * Math.PI * 2) * 2;

    // Vertical movement
    groupRef.current.position.y = -scroll * 3 + 1;

    // Continuous rotation
    groupRef.current.rotation.y = scroll * Math.PI * 4;
    groupRef.current.rotation.z = Math.sin(scroll * Math.PI * 2) * 0.3;

    // Pulse scale
    const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    groupRef.current.scale.setScalar(pulseScale);
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Main Hull - Futuristic shape */}
        <mesh position={[0, 0, 0]} ref={meshRef} castShadow>
          <coneGeometry args={[0.3, 1.2, 4]} />
          <meshStandardMaterial
            color="#6366f1"
            metalness={0.8}
            roughness={0.2}
            emissive="#8b5cf6"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Cockpit Window */}
        <mesh position={[0, 0.3, 0.2]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.7}
            emissive="#60a5fa"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Wings */}
        <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <boxGeometry args={[0.6, 0.05, 0.3]} />
          <meshStandardMaterial
            color="#4f46e5"
            metalness={0.7}
            roughness={0.3}
            emissive="#6366f1"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0.4, 0, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <boxGeometry args={[0.6, 0.05, 0.3]} />
          <meshStandardMaterial
            color="#4f46e5"
            metalness={0.7}
            roughness={0.3}
            emissive="#6366f1"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Engine Glow */}
        <pointLight position={[0, -0.6, 0]} color="#ec4899" intensity={2} distance={3} />
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Exhaust Trail Particles */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0, -0.8 - i * 0.2, 0]}>
            <sphereGeometry args={[0.05 - i * 0.008, 8, 8]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#f97316"
              emissiveIntensity={1.5 - i * 0.2}
              transparent
              opacity={0.6 - i * 0.1}
            />
          </mesh>
        ))}

        {/* Detail Lights */}
        <pointLight position={[0.3, 0.2, 0.2]} color="#06b6d4" intensity={1} distance={2} />
        <pointLight position={[-0.3, 0.2, 0.2]} color="#06b6d4" intensity={1} distance={2} />
      </group>
    </Float>
  );
}

// Main 3D Scene Component
function Scene3D({ scrollProgress }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light */}
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      
      {/* Accent lights */}
      <pointLight position={[-5, 0, 0]} color="#8b5cf6" intensity={0.5} />
      <pointLight position={[5, 0, 0]} color="#06b6d4" intensity={0.5} />

      {/* Spacecraft */}
      <SpacecraftModel scrollProgress={scrollProgress} />

      {/* Background stars */}
      <Stars />
    </>
  );
}

// Animated stars background
function Stars() {
  const starsRef = useRef();

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      starsRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  const starPositions = React.useMemo(() => {
    const positions = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      positions.push(x, y, z);
    }
    return new Float32Array(positions);
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starPositions.length / 3}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.8} />
    </points>
  );
}

// Main Component with ScrollTrigger
export default function StickySpacecraft() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef();

  useEffect(() => {
    // GSAP ScrollTrigger for smooth scroll tracking
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          setScrollProgress(self.progress);
          
          // Hide at bottom
          if (self.progress > 0.95) {
            setVisible(false);
          } else {
            setVisible(true);
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* 3D Canvas */}
      <div className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none">
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene3D scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* Mission Badge - 2D Overlay */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="relative opacity-90">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

          <div className="px-5 py-2 bg-black/80 backdrop-blur-md border border-cyan-400/60 rounded">
            <div className="text-xs font-bold text-cyan-300 tracking-wider mb-0.5">
              EXPLORER-1
            </div>
            <div className="text-[9px] text-cyan-400/80 font-mono tracking-wide">
              3D DEEP SPACE MISSION
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
