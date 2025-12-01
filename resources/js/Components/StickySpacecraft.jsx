import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function StickySpacecraft() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const spacecraftRef = useRef(null);
  const animationIdRef = useRef(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Show spacecraft after hero section
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (!heroSection) return;

      const rect = heroSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Show when hero section starts scrolling out
      if (rect.bottom < windowHeight) {
        setIsVisible(true);
        // Calculate scroll progress
        const totalScroll = document.documentElement.scrollHeight - windowHeight;
        const currentScroll = window.scrollY;
        const progress = currentScroll / totalScroll;
        setScrollProgress(progress);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isVisible) return;

    // Setup Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(200, 200);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00ffff, 1, 50);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Create spacecraft geometry (rocket shape)
    const createSpacecraft = () => {
      const group = new THREE.Group();

      // Main body (cone)
      const bodyGeometry = new THREE.ConeGeometry(0.5, 3, 8);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.8,
        roughness: 0.2,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0;
      group.add(body);

      // Nose cone
      const noseGeometry = new THREE.ConeGeometry(0.5, 1, 8);
      const noseMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4444,
        metalness: 0.9,
        roughness: 0.1,
      });
      const nose = new THREE.Mesh(noseGeometry, noseMaterial);
      nose.position.y = 2;
      group.add(nose);

      // Wings
      const wingGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.5);
      const wingMaterial = new THREE.MeshStandardMaterial({
        color: 0x4444ff,
        metalness: 0.7,
        roughness: 0.3,
      });
      
      const wing1 = new THREE.Mesh(wingGeometry, wingMaterial);
      wing1.position.set(0, -1, 0);
      wing1.rotation.z = Math.PI / 6;
      group.add(wing1);

      const wing2 = new THREE.Mesh(wingGeometry, wingMaterial);
      wing2.position.set(0, -1, 0);
      wing2.rotation.z = -Math.PI / 6;
      group.add(wing2);

      // Engine glow
      const glowGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.5, 8);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.y = -1.7;
      group.add(glow);

      // Exhaust particles
      const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.6,
      });
      
      for (let i = 0; i < 5; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(
          (Math.random() - 0.5) * 0.3,
          -2 - i * 0.3,
          (Math.random() - 0.5) * 0.3
        );
        particle.userData = { speed: 0.05 + Math.random() * 0.05 };
        group.add(particle);
      }

      return group;
    };

    const spacecraft = createSpacecraft();
    spacecraft.rotation.z = -Math.PI / 6; // Tilt for travel
    scene.add(spacecraft);
    spacecraftRef.current = spacecraft;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (spacecraftRef.current) {
        // Rotation based on scroll
        spacecraftRef.current.rotation.y += 0.01;
        
        // Wobble effect
        const time = Date.now() * 0.001;
        spacecraftRef.current.position.y = Math.sin(time * 2) * 0.2;
        spacecraftRef.current.position.x = Math.sin(time) * 0.1;

        // Animate exhaust particles
        spacecraftRef.current.children.forEach((child) => {
          if (child.userData.speed) {
            child.position.y -= child.userData.speed;
            if (child.position.y < -4) {
              child.position.y = -2;
            }
            child.material.opacity = 0.6 - ((-2 - child.position.y) / 2) * 0.6;
          }
        });

        // Tilt based on scroll direction
        const targetRotation = scrollProgress * Math.PI * 0.2;
        spacecraftRef.current.rotation.z += (targetRotation - spacecraftRef.current.rotation.z) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [isVisible, scrollProgress]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-40 pointer-events-none transition-all duration-700 ease-out"
      style={{
        top: `${10 + scrollProgress * 40}%`,
        right: `${5 + Math.sin(scrollProgress * Math.PI) * 10}%`,
        transform: `scale(${1 + scrollProgress * 0.5}) rotate(${scrollProgress * 45}deg)`,
        opacity: Math.max(0.7, 1 - scrollProgress * 0.3),
      }}
    >
      <div className="relative">
        {/* Glow trail */}
        <div
          className="absolute inset-0 blur-2xl rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,255,0.4) 0%, transparent 70%)',
            width: '300px',
            height: '300px',
            transform: 'translate(-35%, -35%)',
          }}
        />
        
        {/* Speed lines */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-0.5 bg-gradient-to-r from-cyan-400 to-transparent animate-pulse"
              style={{
                width: `${40 + i * 10}px`,
                opacity: 0.3 + i * 0.1,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* 3D Canvas */}
        <div ref={containerRef} className="relative" />

        {/* Label */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full">
            <span className="text-xs font-bold text-cyan-300">EXPLORER-1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
