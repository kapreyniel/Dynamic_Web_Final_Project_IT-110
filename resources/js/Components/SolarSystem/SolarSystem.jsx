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
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const floatingRendererRef = useRef(null);
  const floatingSceneRef = useRef(null);
  const floatingCameraRef = useRef(null);
  const floatingPlanetRef = useRef(null);

  const [currentExhibit, setCurrentExhibit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exhibitInfo, setExhibitInfo] = useState(null);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [isFloating, setIsFloating] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
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

    // Add mouse move listener for hover detection
    const handleMouseMove = (event) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Scroll listener for floating planet
    const handleScroll = () => {
      const earthSection = document.getElementById('earth');
      if (!earthSection) return;

      const rect = earthSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Activate floating when section is scrolling out
      if (rect.bottom < windowHeight * 0.6) {
        setIsFloating(true);
        // Calculate scroll progress (0 to 1+)
        const progress = Math.max(0, -rect.bottom / windowHeight);
        setScrollProgress(progress);
      } else {
        setIsFloating(false);
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Check for planet hover
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(
        planetsRef.current,
        true
      );

      if (intersects.length > 0) {
        // Find the planet object (might be a child mesh of the GLB model)
        let planetObject = intersects[0].object;
        while (planetObject.parent && !planetObject.userData.planet) {
          planetObject = planetObject.parent;
        }

        if (planetObject.userData.planet) {
          const planetKey = planetObject.userData.planet;
          if (hoveredPlanet !== planetKey) {
            setHoveredPlanet(planetKey);
            const data = planetData[planetKey];
            if (data) {
              setExhibitInfo({
                title: data.name,
                description: data.description,
              });
            }
          }
        }
      } else {
        if (hoveredPlanet !== null) {
          setHoveredPlanet(null);
          setExhibitInfo(null);
        }
      }

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

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
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
    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
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
      const orbitGeometry = new THREE.RingGeometry(
        radius - 0.1,
        radius + 0.1,
        128
      );
      const orbit = new THREE.Mesh(orbitGeometry, orbitalMaterial);
      orbit.rotation.x = -Math.PI / 2;
      scene.add(orbit);
    });
  };

  const createPlanets = (scene) => {
    const loader = new GLTFLoader();
    let loadedCount = 0;
    const totalPlanets = Object.keys(planetData).length;

    Object.keys(planetData).forEach((key) => {
      const data = planetData[key];

      // For Sun, create glowing sphere
      if (key === "sun") {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({
          color: data.color,
          emissive: data.emissive || data.color,
          emissiveIntensity: 0.8,
        });
        const planet = new THREE.Mesh(geometry, material);
        planet.position.set(0, 0, 0);
        planet.userData = {
          planet: key,
          type: "star",
          rotationSpeed: 0.005,
        };

        // Add solar corona
        const coronaGeometry = new THREE.SphereGeometry(
          data.radius * 1.1,
          32,
          32
        );
        const coronaMaterial = new THREE.MeshBasicMaterial({
          color: 0xff4500,
          transparent: true,
          opacity: 0.3,
          side: THREE.BackSide,
        });
        const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
        planet.add(corona);

        scene.add(planet);
        planetsRef.current.push(planet);
        planetObjectsRef.current[key] = planet;
        loadedCount++;
        return;
      }

      // Try to load GLB model for other planets
      if (data.modelPath) {
        loader.load(
          data.modelPath,
          (gltf) => {
            const model = gltf.scene;
            model.scale.set(data.scale, data.scale, data.scale);
            model.position.set(data.orbitRadius, 0, 0);

            // Enable shadows
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            model.userData = {
              planet: key,
              type: "planet",
              orbitRadius: data.orbitRadius,
              orbitSpeed: data.orbitSpeed,
              rotationSpeed: 0.01,
              isGLBModel: true,
            };

            scene.add(model);
            planetsRef.current.push(model);
            planetObjectsRef.current[key] = model;

            // Add special features
            addPlanetFeatures(key, model, data);

            loadedCount++;
            if (loadedCount === totalPlanets) {
              setLoading(false);
            }
          },
          (progress) => {
            // Loading progress
            const percent = (progress.loaded / progress.total) * 100;
            console.log(`Loading ${key}: ${percent.toFixed(0)}%`);
          },
          (error) => {
            console.error(`Error loading ${key} model:`, error);
            // Fallback to geometric sphere
            createFallbackPlanet(key, data, scene);
            loadedCount++;
            if (loadedCount === totalPlanets) {
              setLoading(false);
            }
          }
        );
      } else {
        // No model path, use geometric sphere
        createFallbackPlanet(key, data, scene);
        loadedCount++;
      }
    });

    // Set loading to false after a timeout if models don't load
    setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 5000);
  };

  const createFallbackPlanet = (key, data, scene) => {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: data.color,
      roughness: 0.7,
      metalness: 0.3,
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(data.orbitRadius, 0, 0);
    planet.userData = {
      planet: key,
      type: "planet",
      orbitRadius: data.orbitRadius,
      orbitSpeed: data.orbitSpeed,
      rotationSpeed: 0.02,
      isGLBModel: false,
    };

    scene.add(planet);
    planetsRef.current.push(planet);
    planetObjectsRef.current[key] = planet;

    addPlanetFeatures(key, planet, data);
  };

  const addPlanetFeatures = (key, planet, data) => {
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

    // Add rings to Saturn (only for fallback geometric model)
    if (data.hasRings && !planet.userData.isGLBModel) {
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
      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      cameraRef.current.position.lerpVectors(
        startPosition,
        targetPosition,
        easeProgress
      );
      controlsRef.current.target.lerpVectors(
        startTarget,
        targetLookAt,
        easeProgress
      );

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

  // Setup floating planet when scroll activates
  useEffect(() => {
    if (!isFloating) return;

    const floatingContainer = document.getElementById('floating-planet-canvas');
    if (!floatingContainer || floatingRendererRef.current) return;

    // Create mini scene for floating planet
    const scene = new THREE.Scene();
    floatingSceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 15;
    floatingCameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(200, 200);
    renderer.setPixelRatio(window.devicePixelRatio);
    floatingContainer.appendChild(renderer.domElement);
    floatingRendererRef.current = renderer;

    // Clone current planet
    const currentPlanetKey = exhibits[currentExhibit].name.toLowerCase();
    const originalPlanet = planetObjectsRef.current[currentPlanetKey];
    
    if (originalPlanet) {
      const planet = originalPlanet.clone();
      planet.position.set(0, 0, 0);
      scene.add(planet);
      floatingPlanetRef.current = planet;
    }

    // Add light
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // Animation loop for floating planet
    const animateFloating = () => {
      if (!floatingRendererRef.current) return;
      requestAnimationFrame(animateFloating);

      if (floatingPlanetRef.current) {
        floatingPlanetRef.current.rotation.y += 0.005;
        // Morph based on scroll
        const scale = 1 + Math.sin(scrollProgress * 2) * 0.2;
        floatingPlanetRef.current.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);
    };
    animateFloating();

    return () => {
      if (floatingRendererRef.current) {
        floatingContainer.removeChild(floatingRendererRef.current.domElement);
        floatingRendererRef.current.dispose();
        floatingRendererRef.current = null;
      }
    };
  }, [isFloating, currentExhibit]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating Planet */}
      {isFloating && (
        <div 
          className="fixed z-50 transition-all duration-700 ease-out pointer-events-none"
          style={{
            top: `${20 + scrollProgress * 30}%`,
            left: `${10 + Math.sin(scrollProgress) * 40}%`,
            transform: `scale(${1 + scrollProgress * 0.5}) rotate(${scrollProgress * 180}deg)`,
            opacity: Math.max(0.3, 1 - scrollProgress * 0.5),
          }}
        >
          <div className="relative">
            {/* Glow effect */}
            <div 
              className="absolute inset-0 blur-2xl rounded-full animate-pulse"
              style={{
                background: planetData[exhibits[currentExhibit].name.toLowerCase()]?.color || '#ffffff',
                opacity: 0.4,
                width: '250px',
                height: '250px',
                transform: 'translate(-25%, -25%)'
              }}
            />
            {/* Planet canvas */}
            <div id="floating-planet-canvas" className="relative" />
            {/* Planet label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white font-bold text-sm whitespace-nowrap">
              {exhibits[currentExhibit].name}
            </div>
          </div>
        </div>
      )}

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
              <div
                className="h-full bg-cosmic-purple animate-pulse"
                style={{ width: "70%" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
