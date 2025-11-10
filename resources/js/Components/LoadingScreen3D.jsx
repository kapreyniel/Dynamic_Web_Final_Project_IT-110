import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

export default function LoadingScreen3D({ onLoadingComplete }) {
  const mountRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

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

    // Create starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Create rotating planet
    const planetGeometry = new THREE.SphereGeometry(2, 32, 32);
    const planetMaterial = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      emissive: 0x2d1b69,
      shininess: 30,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);

    // Create ring around planet
    const ringGeometry = new THREE.TorusGeometry(3, 0.1, 16, 100);
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: 0xec4899,
      emissive: 0x831843,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 8;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate planet and ring
      planet.rotation.y += 0.005;
      ring.rotation.z += 0.003;
      
      // Rotate starfield slowly
      starField.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };
    animate();

    // Simulate loading progress
    const loadingSteps = [
      { progress: 20, text: 'Loading cosmic assets...' },
      { progress: 40, text: 'Preparing galaxies...' },
      { progress: 60, text: 'Initializing navigation...' },
      { progress: 80, text: 'Loading star systems...' },
      { progress: 100, text: 'Ready to explore!' },
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
    }, 800);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(loadingInterval);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Loading UI Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Logo/Title */}
          <motion.h1
            className="text-6xl md:text-8xl font-display font-bold mb-8 gradient-text"
            animate={{
              textShadow: [
                '0 0 20px rgba(236, 72, 153, 0.5)',
                '0 0 40px rgba(79, 70, 229, 0.8)',
                '0 0 20px rgba(236, 72, 153, 0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Beyond Earth
          </motion.h1>

          {/* Progress Bar */}
          <div className="w-80 md:w-96 mx-auto mb-6">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-blue"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Loading Text */}
          <motion.p
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xl text-white/70"
          >
            {loadingText}
          </motion.p>

          {/* Progress Percentage */}
          <motion.p
            className="text-4xl font-bold mt-4 gradient-text"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {progress}%
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
