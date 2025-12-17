import React, { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function MarsModel({ isHovered }) {
  const meshRef = useRef();
  const gltf = useLoader(GLTFLoader, "/models/mars.glb");

  // Auto-rotate Mars
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;

      // Subtle floating animation
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      // Scale up slightly on hover
      const targetScale = isHovered ? 1.15 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

function MarsScene({ isHovered }) {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} />

      {/* Directional light simulating sunlight */}
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ff9966" />

      {/* Point light for Mars glow */}
      <pointLight position={[-3, 0, -3]} intensity={0.8} color="#ff6633" />

      {/* Mars Model */}
      <MarsModel isHovered={isHovered} />

      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />

      {/* Orbit Controls for interaction */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
        rotateSpeed={0.5}
      />
    </>
  );
}

export default function InteractiveMars() {
  const [isHovered, setIsHovered] = useState(false);
  const [facts] = useState([
    {
      icon: "🔴",
      title: "The Red Planet",
      description: "Mars gets its red color from iron oxide (rust) in its soil",
    },
    {
      icon: "🏔️",
      title: "Olympus Mons",
      description:
        "Home to the largest volcano in the solar system at 21km high",
    },
    {
      icon: "❄️",
      title: "Polar Ice Caps",
      description: "Mars has ice caps made of water and frozen CO2",
    },
    {
      icon: "🌙",
      title: "Two Moons",
      description: "Phobos and Deimos orbit the Red Planet",
    },
  ]);

  return (
    <section
      id="mars"
      className="relative min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black py-12 md:py-20 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,68,68,0.1)_0%,_transparent_70%)]" />

      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4">
            Explore <span className="text-red-500">Mars</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-2">
            Interact with the Red Planet in 3D. Click and drag to rotate, scroll
            to zoom.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* 3D Mars Canvas */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div
              className="relative rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl"
              style={{
                height: "300px",
                minHeight: "300px",
                maxHeight: "600px",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Red glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-orange-500/20 pointer-events-none z-10" />

              <Canvas
                className="bg-black"
                gl={{ antialias: true, alpha: false }}
              >
                <MarsScene isHovered={isHovered} />
              </Canvas>

              {/* Interaction hint */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isHovered ? 0 : 1 }}
                className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 px-2"
              >
                <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-full px-4 sm:px-6 py-2 sm:py-3">
                  <p className="text-white text-xs sm:text-sm font-medium flex items-center gap-2">
                    <span className="animate-pulse">👆</span>
                    <span className="hidden sm:inline">
                      Click and drag to explore
                    </span>
                    <span className="sm:hidden">Tap to explore</span>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Mars Facts */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-red-950/30 to-black/50 backdrop-blur-sm border border-red-500/20 rounded-lg sm:rounded-2xl p-4 sm:p-6 md:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">🔴</span>
                <span>Mars Facts</span>
              </h3>

              <div className="space-y-3 sm:space-y-4">
                {facts.map((fact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-black/30 border border-red-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-red-950/20 hover:border-red-500/40 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <span className="text-2xl sm:text-3xl flex-shrink-0">
                        {fact.icon}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-white font-semibold text-sm sm:text-lg mb-1">
                          {fact.title}
                        </h4>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {fact.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mars Stats */}
              <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-black/40 border border-red-500/20 rounded-lg p-2 sm:p-4 text-center">
                  <div className="text-red-400 text-sm sm:text-2xl font-bold">
                    227.9M km
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm mt-1">
                    From Sun
                  </div>
                </div>
                <div className="bg-black/40 border border-red-500/20 rounded-lg p-2 sm:p-4 text-center">
                  <div className="text-red-400 text-sm sm:text-2xl font-bold">
                    687 days
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm mt-1">
                    Orbit Period
                  </div>
                </div>
                <div className="bg-black/40 border border-red-500/20 rounded-lg p-2 sm:p-4 text-center">
                  <div className="text-red-400 text-sm sm:text-2xl font-bold">
                    -63°C
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm mt-1">
                    Avg Temp
                  </div>
                </div>
                <div className="bg-black/40 border border-red-500/20 rounded-lg p-2 sm:p-4 text-center">
                  <div className="text-red-400 text-sm sm:text-2xl font-bold">
                    6,779 km
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm mt-1">
                    Diameter
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
