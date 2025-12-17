import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Float,
  MeshDistortMaterial,
  Sparkles,
  Trail,
  useTexture,
} from "@react-three/drei";
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

    // Start from far left (continuing from AuthPage exit) for seamless handoff
    gsap.fromTo(
      groupRef.current.position,
      { x: -12, y: 0, z: 0 }, // Enters from left where AuthPage spacecraft exits
      {
        duration: 3, // Slower, more cinematic entry
        x: 0,
        ease: "power2.inOut",
        delay: 0.5, // Small delay for transition overlap
      }
    );

    // Start with forward-facing orientation, smoothly transition
    gsap.fromTo(
      groupRef.current.rotation,
      { z: 0 }, // Start level for continuity
      {
        duration: 3,
        z: 0,
        ease: "power2.inOut",
        delay: 0.5,
      }
    );

    // Cinematic scale entrance - start large from AuthPage
    gsap.fromTo(
      groupRef.current.scale,
      { x: 2.2, y: 2.2, z: 2.2 }, // Match AuthPage end scale
      {
        duration: 3,
        x: 1,
        y: 1,
        z: 1,
        ease: "power2.inOut",
        delay: 0.5,
      }
    );
  }, []);

  // GSAP animation based on scroll with enhanced easing
  useFrame((state) => {
    if (!groupRef.current) return;

    const scroll = scrollProgress;

    // GSAP-style easing applied to positions - smooth cubic easing
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easedScroll = easeInOutCubic(scroll);

    // Cinematic horizontal S-curve path - wider range for dramatic effect
    groupRef.current.position.x = Math.sin(scroll * Math.PI * 2) * 2.5;

    // Vertical descent with smooth easing - deeper travel
    groupRef.current.position.y = -easedScroll * 4 + 1;

    // Cinematic continuous rotation with barrel rolls - smoother transitions
    groupRef.current.rotation.y = scroll * Math.PI * 4; // Smoother rotation
    groupRef.current.rotation.z = Math.sin(scroll * Math.PI * 2) * 0.3;
    groupRef.current.rotation.x = Math.cos(scroll * Math.PI * 2.5) * 0.15; // Smoother pitch

    // Dynamic scale - grows and shrinks for depth perception
    const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    const depthScale = 1 + scroll * 0.7; // Grows as it descends
    groupRef.current.scale.setScalar(pulseScale * depthScale);
  });

  return (
    // R3F Drei Float component for organic motion
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Main Hull - Futuristic shape with Tailwind indigo colors */}
        <mesh position={[0, 0, 0]} ref={meshRef} castShadow receiveShadow>
          <coneGeometry args={[0.3, 1.2, 16]} />
          <meshStandardMaterial
            color="#6366f1" // Tailwind indigo-500
            metalness={0.8}
            roughness={0.2}
            emissive="#8b5cf6" // Tailwind violet-500
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Cockpit Window with Tailwind blue palette */}
        <mesh position={[0, 0.3, 0.2]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#3b82f6" // Tailwind blue-500
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.7}
            emissive="#60a5fa" // Tailwind blue-400
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Wings with Tailwind indigo */}
        <mesh
          position={[-0.4, 0, 0]}
          rotation={[0, 0, Math.PI / 6]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.6, 0.05, 0.3]} />
          <meshStandardMaterial
            color="#4f46e5" // Tailwind indigo-600
            metalness={0.7}
            roughness={0.3}
            emissive="#6366f1" // Tailwind indigo-500
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh
          position={[0.4, 0, 0]}
          rotation={[0, 0, -Math.PI / 6]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.6, 0.05, 0.3]} />
          <meshStandardMaterial
            color="#4f46e5" // Tailwind indigo-600
            metalness={0.7}
            roughness={0.3}
            emissive="#6366f1" // Tailwind indigo-500
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Engine Glow with Tailwind pink */}
        <pointLight
          position={[0, -0.6, 0]}
          color="#ec4899" // Tailwind pink-500
          intensity={2}
          distance={3}
          decay={2}
        />
        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#ec4899" // Tailwind pink-500
            emissive="#ec4899"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Exhaust Trail Particles with Tailwind orange - extended for motion blur effect */}
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[0, -0.8 - i * 0.15, 0]}>
            <sphereGeometry args={[0.06 - i * 0.006, 16, 16]} />
            <meshStandardMaterial
              color="#f97316" // Tailwind orange-500
              emissive="#f97316"
              emissiveIntensity={2 - i * 0.2}
              transparent
              opacity={0.8 - i * 0.09}
            />
          </mesh>
        ))}

        {/* Detail Lights with Tailwind cyan */}
        <pointLight
          position={[0.3, 0.2, 0.2]}
          color="#06b6d4" // Tailwind cyan-500
          intensity={1}
          distance={2}
        />
        <pointLight
          position={[-0.3, 0.2, 0.2]}
          color="#06b6d4" // Tailwind cyan-500
          intensity={1}
          distance={2}
        />
      </group>
    </Float>
  );
}

// Main 3D Scene Component with enhanced R3F features
function Scene3D({ scrollProgress }) {
  const lightRef = useRef();

  // Animate lights with GSAP + R3F
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime) * 0.3;
    }
  });

  return (
    <>
      {/* R3F Drei PerspectiveCamera */}
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

      {/* Ambient lighting with Tailwind color values */}
      <ambientLight intensity={0.3} color="#e0f2fe" />

      {/* Main directional light with shadows */}
      <directionalLight
        ref={lightRef}
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#fef3c7"
      />

      {/* Accent lights using Tailwind purple/cyan palette */}
      <pointLight position={[-5, 0, 0]} color="#8b5cf6" intensity={0.5} />
      <pointLight position={[5, 0, 0]} color="#06b6d4" intensity={0.5} />
      <pointLight position={[0, 5, -5]} color="#ec4899" intensity={0.3} />

      {/* R3F Drei Sparkles for space dust */}
      <Sparkles
        count={200}
        scale={15}
        size={2}
        speed={0.3}
        opacity={0.6}
        color="#60a5fa"
      />

      {/* Spacecraft with Float animation */}
      <SpacecraftModel scrollProgress={scrollProgress} />

      {/* Animated star field */}
      <Stars />
    </>
  );
}

// Animated stars background using R3F
function Stars() {
  const starsRef = useRef();

  // R3F useFrame for continuous animation
  useFrame((state) => {
    if (starsRef.current) {
      // Slow rotation for parallax effect
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      starsRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  // Memoize star positions for performance
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
      {/* Tailwind white color */}
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
          // Keep visible throughout entire scroll including footer
          setVisible(true);
        },
      });
    });

    return () => ctx.revert();
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* R3F Canvas with optimized settings */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <Canvas
          shadows
          dpr={[1, 2]} // Device pixel ratio for performance
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          className="bg-transparent" // Tailwind for transparent background
        >
          <Scene3D scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* Mission Badge - Tailwind CSS overlay */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-opacity duration-500">
        <div className="relative opacity-90 animate-pulse">
          {/* Corner decorations - Tailwind borders */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400 transition-all duration-300" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400 transition-all duration-300" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400 transition-all duration-300" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400 transition-all duration-300" />

          {/* Tailwind badge styling */}
          <div className="px-5 py-2 bg-black/80 backdrop-blur-md border border-cyan-400/60 rounded shadow-lg shadow-cyan-500/50">
            <div className="text-xs font-bold text-cyan-300 tracking-wider mb-0.5">
              EXPLORER-1
            </div>
            <div className="text-[9px] text-cyan-400/80 font-mono tracking-wide">
              3D DEEP SPACE MISSION • R3F + GSAP
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
