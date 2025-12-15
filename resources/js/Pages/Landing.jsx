import React, { useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars, Float, PerspectiveCamera } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import {
  FaRocket,
  FaSpaceShuttle,
  FaGlobeAmericas,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";

// Planet with GLB Model Component
function PlanetModel({ modelPath, scale, distance, speed }) {
  const planetRef = useRef();
  const orbitRef = useRef();
  const gltf = useLoader(GLTFLoader, modelPath);

  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += speed;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={orbitRef}>
      <primitive
        ref={planetRef}
        object={gltf.scene.clone()}
        scale={scale}
        position={[distance, 0, 0]}
      />
    </group>
  );
}

// Sun Model Component
function SunModel() {
  const sunRef = useRef();
  const gltf = useLoader(GLTFLoader, "/models/sun.glb");

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      <primitive
        ref={sunRef}
        object={gltf.scene}
        scale={1.6}
        position={[0, 0, 0]}
      />
      {/* Sun Glow */}
      <mesh scale={1.8}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}

// Animated Solar System Component
function AnimatedSolarSystem() {
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      {/* Sun with GLB Model */}
      <SunModel />

      {/* Planets with GLB Models */}
      <PlanetModel
        modelPath="/models/mercury.glb"
        scale={0.3}
        distance={2.5}
        speed={0.015}
      />
      <PlanetModel
        modelPath="/models/venus.glb"
        scale={0.5}
        distance={4.0}
        speed={0.012}
      />
      <PlanetModel
        modelPath="/models/earth.glb"
        scale={0.55}
        distance={5.5}
        speed={0.01}
      />
      <PlanetModel
        modelPath="/models/mars.glb"
        scale={0.4}
        distance={7.0}
        speed={0.008}
      />
      <PlanetModel
        modelPath="/models/jupiter.glb"
        scale={1.0}
        distance={10.0}
        speed={0.005}
      />
      <PlanetModel
        modelPath="/models/saturn.glb"
        scale={0.9}
        distance={13.0}
        speed={0.004}
      />
    </Float>
  );
}

// 3D Scene Component
function Scene3D() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={75} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <AnimatedSolarSystem />
    </>
  );
}

export default function Landing({ auth }) {
  const features = [
    {
      icon: <FaRocket />,
      title: "Explore the Cosmos",
      description:
        "Journey through stunning NASA imagery from distant galaxies to our solar system.",
    },
    {
      icon: <FaSpaceShuttle />,
      title: "Mars Mission",
      description:
        "Experience real photos from Mars rovers exploring the red planet's surface.",
    },
    {
      icon: <FaGlobeAmericas />,
      title: "Interactive Solar System",
      description:
        "Navigate through our solar system with realistic 3D planet models and interactive controls.",
    },
    {
      icon: <FaStar />,
      title: "Save Favorites",
      description:
        "Curate your personal collection of breathtaking cosmic discoveries.",
    },
  ];

  return (
    <>
      <Head title="Beyond Earth - Journey Through Space" />

      <div className="min-h-screen bg-gradient-to-b from-space-dark via-black to-space-dark text-white overflow-hidden">
        {/* Animated Solar System Background */}
        <div className="fixed inset-0 z-0">
          <Canvas>
            <Scene3D />
          </Canvas>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-display font-bold gradient-text"
            >
              Beyond Earth
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4"
            >
              <button
                onClick={() => (window.location.href = "/explore")}
                className="px-6 py-2 bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-lg font-semibold hover:shadow-lg hover:shadow-cosmic-purple/50 transition-all"
              >
                Explore
              </button>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-display font-bold mb-6 gradient-text leading-tight"
            >
              Explore the Universe
              <br />
              Beyond Earth
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto"
            >
              Embark on an extraordinary journey through space with real NASA
              imagery, interactive experiences, and breathtaking cosmic wonders.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => (window.location.href = "/explore")}
                className="px-8 py-4 bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-lg font-semibold text-lg hover:shadow-xl hover:shadow-cosmic-purple/50 transition-all flex items-center gap-2 group"
              >
                Join the Mission
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#features"
                className="px-8 py-4 glass-card hover:bg-white/20 transition-colors rounded-lg font-semibold text-lg"
              >
                Learn More
              </a>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative z-10 container mx-auto px-6 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "1000+", label: "NASA Images" },
              { value: "3D", label: "Interactive Views" },
              { value: "Live", label: "API Data" },
              { value: "∞", label: "Discoveries" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center glass-card p-6"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="relative z-10 container mx-auto px-6 py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 gradient-text">
              Features That Inspire
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover what makes Beyond Earth your gateway to the cosmos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-card p-8 group cursor-pointer"
              >
                <div className="text-5xl text-cosmic-purple mb-4 group-hover:scale-110 transition-transform inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 container mx-auto px-6 py-20 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center max-w-3xl mx-auto bg-gradient-to-br from-cosmic-purple/20 to-cosmic-pink/20 border border-cosmic-purple/30"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-text">
              Ready to Explore?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of space enthusiasts discovering the wonders of our
              universe
            </p>
            <button
              onClick={() => (window.location.href = "/explore")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-lg font-semibold text-lg hover:shadow-xl hover:shadow-cosmic-purple/50 transition-all group"
            >
              Join the Mission
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 py-8">
          <div className="container mx-auto px-6 text-center text-white/50">
            <p>
              © 2025 Beyond Earth. Powered by NASA API.
              <br />
              <span className="text-sm">
                Journey through space, one discovery at a time.
              </span>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
