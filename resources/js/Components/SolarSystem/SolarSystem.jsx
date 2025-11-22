import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import SolarSystemUI from "./SolarSystemUI";
import { planetData } from "./planetData";

export default function SolarSystem() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const planetsRef = useRef([]);
  const planetObjectsRef = useRef({});
  const moonsRef = useRef([]);
  const animationIdRef = useRef(null);
  
  const [currentExhibit, setCurrentExhibit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exhibitInfo, setExhibitInfo] = useState(null);
  
  const exhibits = [
    { name: "Sun", progress: 0 },
    { name: "Mercury", progress: 11 },
    { name: "Venus", progress: 22 },
    { name: "Earth", progress: 33 },
    { name: "Mars", progress: 44 },
    { name: "Jupiter", progress: 55 },
    { name: "Saturn", progress: 66 },
    { name: "Uranus", progress: 77 },
    { name: "Neptune", progress: 88 },
    { name: "Pluto", progress: 100 },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 50);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 200;
    controlsRef.current = controls;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x333333, 0.3);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xff6b35, 2, 300);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Create starfield
    createStarfield(scene);

    // Create orbital paths
    createOrbitalPaths(scene);

    // Create planets
    createPlanets(scene);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Animate planets
      planetsRef.current.forEach((planet) => {
        if (planet.userData.planet !== "sun") {
          planet.rotation.y += planet.userData.rotationSpeed;
          
          if (planet.userData.orbitRadius && planet.userData.orbitSpeed) {
            const angle = time * planet.userData.orbitSpeed;
            planet.position.x = Math.cos(angle) * planet.userData.orbitRadius;
            planet.position.z = Math.sin(angle) * planet.userData.orbitRadius;
          }
        } else {
          planet.rotation.y += planet.userData.rotationSpeed;
        }
      });

      // Animate moons
      moonsRef.current.forEach(({ moon }) => {
        moon.rotation.y += moon.userData.rotationSpeed;
        const moonAngle = time * moon.userData.orbitSpeed;
        moon.position.x = Math.cos(moonAngle) * moon.userData.orbitRadius;
        moon.position.z = Math.sin(moonAngle) * moon.userData.orbitRadius;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();
    setLoading(false);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationIdRef.current);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  const createStarfield = (scene) => {
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2000;
      positions[i + 1] = (Math.random() - 0.5) * 2000;
      positions[i + 2] = (Math.random() - 0.5) * 2000;

      const colorVariation = Math.random();
      colors[i] = 0.8 + colorVariation * 0.2;
      colors[i + 1] = 0.8 + colorVariation * 0.2;
      colors[i + 2] = 1.0;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.5,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const starfield = new THREE.Points(starGeometry, starMaterial);
    scene.add(starfield);
  };

  const createOrbitalPaths = (scene) => {
    const orbits = [12, 16, 20, 24, 32, 40, 48, 56, 64];
    const orbitalMaterial = new THREE.LineBasicMaterial({
      color: 0x444477,
      transparent: true,
      opacity: 0.2,
    });

    orbits.forEach((radius) => {
      const orbitGeometry = new THREE.RingGeometry(radius - 0.1, radius + 0.1, 128);
      const orbit = new THREE.Mesh(orbitGeometry, orbitalMaterial);
      orbit.rotation.x = -Math.PI / 2;
      scene.add(orbit);
    });
  };

  const createPlanets = (scene) => {
    Object.keys(planetData).forEach((key) => {
      const data = planetData[key];
      const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
      
      let material;
      if (key === "sun") {
        material = new THREE.MeshBasicMaterial({
          color: data.color,
          emissive: data.emissive || data.color,
          emissiveIntensity: 0.8,
        });
      } else {
        material = new THREE.MeshStandardMaterial({
          color: data.color,
          roughness: 0.7,
          metalness: 0.3,
        });
      }

      const planet = new THREE.Mesh(geometry, material);
      
      if (key === "sun") {
        planet.position.set(0, 0, 0);
      } else {
        planet.position.set(data.orbitRadius, 0, 0);
      }

      planet.userData = {
        planet: key,
        type: key === "sun" ? "star" : "planet",
        orbitRadius: data.orbitRadius,
        orbitSpeed: data.orbitSpeed,
        rotationSpeed: 0.02,
      };

      scene.add(planet);
      planetsRef.current.push(planet);
      planetObjectsRef.current[key] = planet;

      // Add moon to Earth
      if (data.hasMoon) {
        const moonGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const moonMaterial = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          roughness: 0.8,
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(2, 0, 0);
        moon.userData = {
          type: "moon",
          orbitRadius: 2,
          orbitSpeed: 0.05,
          rotationSpeed: 0.01,
        };
        planet.add(moon);
        moonsRef.current.push({ moon, planet });
      }

      // Add rings to Saturn
      if (data.hasRings) {
        const ringGeometry = new THREE.RingGeometry(3.5, 5.0, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = -Math.PI / 2;
        planet.add(rings);
      }
    });
  };

  const moveToPlanet = (planetName) => {
    const planet = planetObjectsRef.current[planetName.toLowerCase()];
    if (!planet || !cameraRef.current || !controlsRef.current) return;

    const data = planetData[planetName.toLowerCase()];
    const cameraDistance = data.cameraDistance || 15;

    const planetPosition = new THREE.Vector3();
    planet.getWorldPosition(planetPosition);

    const cameraPosition = new THREE.Vector3(
      planetPosition.x,
      planetPosition.y + cameraDistance * 0.3,
      planetPosition.z + cameraDistance
    );

    animateCameraTo(cameraPosition, planetPosition);
    
    setExhibitInfo({
      title: data.name,
      description: data.description,
    });
  };

  const animateCameraTo = (targetPosition, targetLookAt) => {
    const startPosition = cameraRef.current.position.clone();
    const startTarget = controlsRef.current.target.clone();
    const startTime = Date.now();
    const duration = 1500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      cameraRef.current.position.lerpVectors(startPosition, targetPosition, easeProgress);
      controlsRef.current.target.lerpVectors(startTarget, targetLookAt, easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const handleNext = () => {
    if (currentExhibit < exhibits.length - 1) {
      const nextExhibit = currentExhibit + 1;
      setCurrentExhibit(nextExhibit);
      moveToPlanet(exhibits[nextExhibit].name);
    }
  };

  const handlePrevious = () => {
    if (currentExhibit > 0) {
      const prevExhibit = currentExhibit - 1;
      setCurrentExhibit(prevExhibit);
      moveToPlanet(exhibits[prevExhibit].name);
    }
  };

  useEffect(() => {
    if (!loading) {
      moveToPlanet(exhibits[currentExhibit].name);
    }
  }, [currentExhibit, loading]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      
      {!loading && (
        <SolarSystemUI
          currentExhibit={exhibits[currentExhibit]}
          exhibitInfo={exhibitInfo}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onCloseInfo={() => setExhibitInfo(null)}
          canGoPrevious={currentExhibit > 0}
          canGoNext={currentExhibit < exhibits.length - 1}
        />
      )}
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-white text-center">
            <div className="text-xl mb-2">Loading Solar System...</div>
            <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-cosmic-purple animate-pulse" style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
