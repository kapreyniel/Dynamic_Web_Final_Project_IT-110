import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Float,
  Sphere,
  MeshDistortMaterial,
  Stars as DreiStars,
  Cloud,
} from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";

// 3D Destination Planet using R3F
function DestinationPlanet({ phase, progress }) {
  const planetRef = useRef();
  const atmosphereRef = useRef();

  useFrame((state) => {
    if (planetRef.current) {
      // Continuous rotation
      planetRef.current.rotation.y += 0.002;

      // Scale based on phase with GSAP-style easing
      const targetScale =
        phase === "landing" ? 3 : phase === "approach" ? 1.2 : 0.5;
      planetRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.05
      );
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= 0.001;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group
        ref={planetRef}
        position={phase === "landing" ? [0, 0, 0] : [3, 1, -2]}
      >
        {/* Planet Core with Tailwind colors */}
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial
            color="#f97316" // Tailwind orange-500
            emissive="#dc2626" // Tailwind red-600
            emissiveIntensity={0.5}
            distort={0.3}
            speed={2}
            roughness={0.4}
          />
        </Sphere>

        {/* Atmosphere Glow */}
        <Sphere args={[1.15, 32, 32]} ref={atmosphereRef}>
          <meshStandardMaterial
            color="#fbbf24" // Tailwind amber-400
            transparent
            opacity={0.3}
            emissive="#fef3c7" // Tailwind amber-100
            emissiveIntensity={0.5}
          />
        </Sphere>

        {/* Ring System */}
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[1.8, 0.1, 16, 100]} />
          <meshStandardMaterial
            color="#a855f7" // Tailwind purple-500
            transparent
            opacity={0.6}
            emissive="#c084fc" // Tailwind purple-400
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Inner Ring */}
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[2.1, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#ec4899" // Tailwind pink-500
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Point light from planet */}
        <pointLight
          position={[0, 0, 0]}
          intensity={2}
          color="#f97316"
          distance={10}
        />
      </group>
    </Float>
  );
}

// 3D Spacecraft Model using R3F
function SpacecraftModel({ phase, spacecraftPosition }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;

    // Cinematic horizontal movement - continuous journey
    // Accelerates from -3 to beyond screen (12 units) for smooth handoff to main spacecraft
    groupRef.current.position.x = -3 + (spacecraftPosition / 100) * 15;

    // Dynamic floating motion - more pronounced during travel
    const floatIntensity =
      phase === "travel" ? 0.2 : phase === "approach" ? 0.15 : 0.1;
    const floatY = Math.sin(state.clock.elapsedTime * 2) * floatIntensity;
    groupRef.current.position.y = floatY;

    // Cinematic roll and pitch for realism
    groupRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
    groupRef.current.rotation.x =
      Math.cos(state.clock.elapsedTime * 1.2) * 0.04;

    // Scale up as it travels for better visibility and dramatic effect
    const scaleProgress = spacecraftPosition / 100;
    const scale = 1 + scaleProgress * 0.8; // Grows from 1x to 1.8x
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group
        ref={groupRef}
        position={[-3, 0, 0]}
        rotation={[0, 0, Math.PI / 8]}
      >
        {/* Main Hull - Tailwind indigo */}
        <mesh castShadow>
          <coneGeometry args={[0.2, 0.8, 4]} />
          <meshStandardMaterial
            color="#6366f1" // Tailwind indigo-500
            metalness={0.9}
            roughness={0.1}
            emissive="#8b5cf6" // Tailwind violet-500
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Cockpit - Tailwind blue */}
        <mesh position={[0, 0.2, 0.15]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#3b82f6" // Tailwind blue-500
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
            emissive="#60a5fa" // Tailwind blue-400
            emissiveIntensity={1}
          />
        </mesh>

        {/* Wings - Tailwind indigo */}
        <mesh
          position={[-0.25, 0, 0]}
          rotation={[0, 0, Math.PI / 4]}
          castShadow
        >
          <boxGeometry args={[0.4, 0.03, 0.2]} />
          <meshStandardMaterial
            color="#4f46e5" // Tailwind indigo-600
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh
          position={[0.25, 0, 0]}
          rotation={[0, 0, -Math.PI / 4]}
          castShadow
        >
          <boxGeometry args={[0.4, 0.03, 0.2]} />
          <meshStandardMaterial
            color="#4f46e5" // Tailwind indigo-600
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Engine Glow - Tailwind pink */}
        <pointLight
          position={[0, -0.4, 0]}
          intensity={2}
          color="#ec4899" // Tailwind pink-500
          distance={2}
        />
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Exhaust particles */}
        {[...Array(3)].map((_, i) => (
          <mesh key={i} position={[0, -0.5 - i * 0.1, 0]}>
            <sphereGeometry args={[0.03 - i * 0.008, 8, 8]} />
            <meshStandardMaterial
              color="#f97316" // Tailwind orange-500
              emissive="#f97316"
              emissiveIntensity={1.5 - i * 0.3}
              transparent
              opacity={0.7 - i * 0.2}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Asteroids using R3F
function Asteroids({ show }) {
  const asteroidsRef = useRef([]);

  useFrame(() => {
    asteroidsRef.current.forEach((asteroid, i) => {
      if (asteroid) {
        asteroid.position.x -= 0.05;
        asteroid.rotation.x += 0.01;
        asteroid.rotation.y += 0.02;

        if (asteroid.position.x < -10) {
          asteroid.position.x = 5;
          asteroid.position.y = (Math.random() - 0.5) * 4;
        }
      }
    });
  });

  if (!show) return null;

  return (
    <group>
      {[...Array(15)].map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (asteroidsRef.current[i] = el)}
          position={[
            Math.random() * 10 - 5,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
          ]}
          castShadow
        >
          <dodecahedronGeometry args={[Math.random() * 0.2 + 0.1, 0]} />
          <meshStandardMaterial
            color="#6b7280" // Tailwind gray-500
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main 3D Scene
function Scene3D({ phase, progress, spacecraftPosition }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={60} />

      {/* Lighting with Tailwind colors */}
      <ambientLight intensity={0.2} color="#e0f2fe" />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        color="#fef3c7"
        castShadow
      />
      <pointLight position={[-5, 0, 0]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#06b6d4" />

      {/* R3F Drei Stars */}
      <DreiStars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* 3D Models */}
      <DestinationPlanet phase={phase} progress={progress} />
      <SpacecraftModel phase={phase} spacecraftPosition={spacecraftPosition} />
      <Asteroids show={phase === "travel" && progress > 20 && progress < 60} />
    </>
  );
}

export default function LoadingScreen3D({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(
    "Initializing spacecraft systems..."
  );
  const [phase, setPhase] = useState("travel");
  const [spacecraftPosition, setSpacecraftPosition] = useState(0);

  useEffect(() => {
    // GSAP-powered loading sequence
    const loadingSteps = [
      {
        progress: 20,
        text: "Initializing spacecraft systems...",
        phase: "travel",
        time: 800,
      },
      {
        progress: 40,
        text: "Accelerating through asteroid field...",
        phase: "travel",
        time: 1000,
      },
      {
        progress: 60,
        text: "Approaching destination planet...",
        phase: "approach",
        time: 1000,
      },
      {
        progress: 80,
        text: "Entering planetary orbit...",
        phase: "approach",
        time: 1000,
      },
      {
        progress: 95,
        text: "Preparing for landing sequence...",
        phase: "landing",
        time: 800,
      },
      { progress: 100, text: "Landing complete!", phase: "landing", time: 400 },
    ];

    let currentStep = 0;

    const runStep = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];

        // GSAP animation for smooth progress
        gsap.to(
          { val: progress },
          {
            val: step.progress,
            duration: step.time / 1000,
            onUpdate: function () {
              setProgress(Math.round(this.targets()[0].val));
            },
            ease: "power2.out",
          }
        );

        setLoadingText(step.text);
        setPhase(step.phase);
        setSpacecraftPosition(step.progress);
        currentStep++;
        setTimeout(runStep, step.time);
      } else {
        if (onLoadingComplete) onLoadingComplete();
      }
    };

    runStep();
  }, [onLoadingComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }} // Longer fade for cinematic transition
    >
      {/* R3F Canvas for 3D scene - stays visible during transition */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 1 }}
        exit={{ opacity: 1 }} // Keep 3D scene visible during exit
        transition={{ duration: 0 }}
      >
        <Canvas shadows dpr={[1, 2]}>
          <Scene3D
            phase={phase}
            progress={progress}
            spacecraftPosition={spacecraftPosition}
          />
        </Canvas>
      </motion.div>

      {/* Loading UI Overlay - Tailwind CSS */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 pointer-events-none z-40">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full max-w-2xl px-6"
        >
          {/* Mission Control Title */}
          <motion.div
            className="mb-6"
            animate={{
              textShadow: [
                "0 0 20px rgba(236, 72, 153, 0.8)",
                "0 0 40px rgba(79, 70, 229, 1)",
                "0 0 20px rgba(236, 72, 153, 0.8)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold gradient-text mb-2 drop-shadow-lg">
              MISSION CONTROL
            </h1>
            <p className="text-cyan-300 text-sm tracking-widest uppercase font-bold">
              R3F + GSAP + Three.js Journey
            </p>
          </motion.div>

          {/* HUD Style Progress - Tailwind */}
          <div className="relative mb-6">
            <div className="relative bg-black/70 backdrop-blur-md border-2 border-cyan-400/50 rounded-lg p-6 shadow-2xl">
              {/* Tailwind corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 transition-all duration-300" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 transition-all duration-300" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 transition-all duration-300" />

              {/* Status Text */}
              <motion.div
                key={loadingText}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-left mb-4"
              >
                <p className="text-cyan-300 font-mono text-sm">STATUS:</p>
                <p className="text-white font-mono text-lg">{loadingText}</p>
              </motion.div>

              {/* Progress Bar - Tailwind gradient */}
              <div className="relative h-4 bg-gray-900/80 rounded-full overflow-hidden border border-cyan-500/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Scanning effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>

              {/* Progress Percentage */}
              <div className="flex justify-between items-center mt-3">
                <span className="text-cyan-400 font-mono text-sm">
                  PROGRESS
                </span>
                <motion.span
                  className="text-2xl font-bold font-mono bg-gradient-to-r from-cyan-500 to-pink-500 bg-clip-text text-transparent"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  {progress}%
                </motion.span>
              </div>
            </div>
          </div>

          {/* Phase Indicators - Tailwind */}
          <div className="flex justify-center gap-4">
            {["LAUNCH", "TRAVEL", "APPROACH", "LANDING"].map((label, idx) => (
              <motion.div
                key={label}
                className={`px-3 py-1 rounded border transition-all duration-300 ${
                  progress >= (idx + 1) * 25
                    ? "border-green-400 bg-green-400/20 text-green-300 shadow-lg shadow-green-500/50"
                    : "border-gray-600 bg-gray-900/40 text-gray-500"
                }`}
                animate={
                  progress >= (idx + 1) * 25 ? { scale: [1, 1.05, 1] } : {}
                }
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-xs font-mono">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scan Lines Effect - Tailwind */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <motion.div
          className="absolute w-full h-2 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
          animate={{ y: [0, 1000] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
