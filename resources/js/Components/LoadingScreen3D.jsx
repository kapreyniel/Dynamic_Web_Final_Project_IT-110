import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

export default function LoadingScreen3D({ onLoadingComplete }) {
  const mountRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");

  useEffect(() => {
    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Create animated starfield with varying sizes
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const starsVertices = [];
    const starsSizes = [];
    for (let i = 0; i < 15000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
      starsSizes.push(Math.random() * 2);
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    starsGeometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(starsSizes, 1)
    );
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Create main rotating planet with bump mapping effect
    const planetGeometry = new THREE.SphereGeometry(2.5, 64, 64);
    const planetMaterial = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      emissive: 0x2d1b69,
      roughness: 0.7,
      metalness: 0.3,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);

    // Create multiple orbital rings
    const rings = [];
    const ringColors = [0xec4899, 0x8b5cf6, 0x06b6d4];
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(3.5 + i * 0.5, 0.08, 16, 100);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: ringColors[i],
        emissive: ringColors[i],
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 3 + (i * Math.PI) / 12;
      ring.rotation.y = (i * Math.PI) / 6;
      rings.push(ring);
      scene.add(ring);
    }

    // Create floating asteroids/debris
    const asteroids = [];
    for (let i = 0; i < 50; i++) {
      const size = Math.random() * 0.15 + 0.05;
      const asteroidGeometry = new THREE.DodecahedronGeometry(size, 0);
      const asteroidMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        emissive: 0x222222,
      });
      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
      
      const distance = 6 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      asteroid.position.x = Math.cos(angle) * distance;
      asteroid.position.y = (Math.random() - 0.5) * 10;
      asteroid.position.z = Math.sin(angle) * distance;
      
      asteroid.userData = {
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        orbitSpeed: Math.random() * 0.001 + 0.0005,
        orbitRadius: distance,
        orbitAngle: angle,
      };
      
      asteroids.push(asteroid);
      scene.add(asteroid);
    }

    // Create glowing particles around planet
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particlesVertices = [];
    for (let i = 0; i < 1000; i++) {
      const radius = 3.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      particlesVertices.push(x, y, z);
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(particlesVertices, 3)
    );
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Add dynamic lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x4f46e5, 2, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 1.5, 100);
    pointLight2.position.set(-10, -5, 5);
    scene.add(pointLight2);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 20, 0);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.5;
    scene.add(spotLight);

    camera.position.z = 12;
    camera.position.y = 2;

    // Animation variables
    let time = 0;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate planet with wobble effect
      planet.rotation.y += 0.008;
      planet.rotation.x = Math.sin(time * 0.5) * 0.1;

      // Animate rings - each rotates differently
      rings.forEach((ring, index) => {
        ring.rotation.z += 0.002 * (index + 1);
        ring.rotation.y += 0.001 * (index + 1);
      });

      // Animate asteroids in orbit
      asteroids.forEach((asteroid) => {
        // Rotate asteroid
        asteroid.rotation.x += asteroid.userData.rotationSpeed;
        asteroid.rotation.y += asteroid.userData.rotationSpeed * 0.5;
        
        // Orbit around planet
        asteroid.userData.orbitAngle += asteroid.userData.orbitSpeed;
        asteroid.position.x = Math.cos(asteroid.userData.orbitAngle) * asteroid.userData.orbitRadius;
        asteroid.position.z = Math.sin(asteroid.userData.orbitAngle) * asteroid.userData.orbitRadius;
      });

      // Rotate particle system
      particleSystem.rotation.y += 0.001;
      particleSystem.rotation.x = Math.sin(time * 0.3) * 0.2;

      // Rotate starfield slowly in multiple directions
      starField.rotation.y += 0.0001;
      starField.rotation.x += 0.00005;

      // Animate camera for dynamic view
      camera.position.x = Math.sin(time * 0.2) * 2;
      camera.position.y = 2 + Math.cos(time * 0.15) * 1;
      camera.lookAt(0, 0, 0);

      // Pulse lights
      pointLight1.intensity = 2 + Math.sin(time) * 0.5;
      pointLight2.intensity = 1.5 + Math.cos(time * 1.5) * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    // Simulate loading progress
    const loadingSteps = [
      { progress: 15, text: "Initializing 3D Engine..." },
      { progress: 30, text: "Loading cosmic assets..." },
      { progress: 50, text: "Preparing galaxies..." },
      { progress: 70, text: "Initializing navigation..." },
      { progress: 90, text: "Loading star systems..." },
      { progress: 100, text: "Ready to explore!" },
    ];

    let currentStep = 0;
    const loadingInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setProgress(loadingSteps[currentStep].progress);
        setLoadingText(loadingSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(loadingInterval);
        setTimeout(() => {
          if (onLoadingComplete) onLoadingComplete();
        }, 500);
      }
    }, 700);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      clearInterval(loadingInterval);
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Animated Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />

      {/* Loading UI Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center relative"
        >
          {/* Glowing orb behind title */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-purple-500/30 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Logo/Title */}
          <motion.h1
            className="text-6xl md:text-8xl font-display font-bold mb-8 gradient-text relative z-10"
            animate={{
              textShadow: [
                "0 0 20px rgba(236, 72, 153, 0.5)",
                "0 0 40px rgba(79, 70, 229, 0.8)",
                "0 0 60px rgba(6, 182, 212, 0.6)",
                "0 0 40px rgba(79, 70, 229, 0.8)",
                "0 0 20px rgba(236, 72, 153, 0.5)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Beyond Earth
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm md:text-base text-cyan-300/70 mb-8 tracking-widest uppercase"
          >
            Journey Through Space
          </motion.p>

          {/* Progress Container */}
          <div className="relative">
            {/* Progress Bar */}
            <div className="w-80 md:w-96 mx-auto mb-6 relative">
              {/* Glow effect behind progress bar */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full blur-md"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <div className="relative h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-blue relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {/* Shimmer effect on progress bar */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Loading Text */}
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg md:text-xl text-white/80 font-light tracking-wide"
            >
              {loadingText}
            </motion.p>

            {/* Progress Percentage */}
            <motion.p
              className="text-5xl md:text-6xl font-bold mt-6 gradient-text"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              {progress}%
            </motion.p>
          </div>

          {/* Spinning loading indicator */}
          <motion.div
            className="mt-8 w-16 h-16 mx-auto border-4 border-purple-500/30 border-t-pink-500 rounded-full"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>

      {/* Corner decorations */}
      <motion.div
        className="absolute top-4 right-4 text-cyan-400/50 text-6xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        ✦
      </motion.div>
      <motion.div
        className="absolute bottom-4 left-4 text-purple-400/50 text-6xl"
        animate={{
          rotate: [360, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        ✦
      </motion.div>
    </div>
  );
}
