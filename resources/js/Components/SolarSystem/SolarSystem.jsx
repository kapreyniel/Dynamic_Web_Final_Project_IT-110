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

  const [currentExhibit, setCurrentExhibit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exhibitInfo, setExhibitInfo] = useState(null);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);

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

  // Fixed planet distances to prevent merging with sun
  // Sun radius is 5, so we need at least 8+ distance for Mercury
  const planetDistances = {
    mercury: 12, // Increased from 8
    venus: 18, // Increased from 12
    earth: 24, // Increased from 16
    mars: 30, // Increased from 20
    jupiter: 45, // Increased from 28
    saturn: 60, // Increased from 36
    uranus: 75, // Increased from 44
    neptune: 90, // Increased from 52
    pluto: 105, // Increased from 60
  };

  // Adjusted planet sizes for better scale
  const planetSizes = {
    sun: 5, // Sun is large but not massive
    mercury: 0.5, // Increased for visibility
    venus: 0.8, // Increased for visibility
    earth: 0.9, // Increased for visibility
    mars: 0.6, // Increased for visibility
    jupiter: 2.5, // Much larger - gas giant
    saturn: 2.0, // Large with rings
    uranus: 1.2, // Increased for visibility
    neptune: 1.2, // Increased for visibility
    pluto: 0.4, // Small dwarf planet
  };

  // Adjusted orbit speeds for better animation
  const orbitSpeeds = {
    mercury: 0.04,
    venus: 0.015,
    earth: 0.01,
    mars: 0.008,
    jupiter: 0.002,
    saturn: 0.001,
    uranus: 0.0007,
    neptune: 0.0005,
    pluto: 0.0004,
  };

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
    camera.position.set(0, 20, 120); // Pulled back to see all planets
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
    controls.maxDistance = 350; // Increased for outer planets
    controlsRef.current = controls;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x333333, 0.3);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xff6b35, 3, 600); // Increased range
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Add directional light for better planet illumination
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

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
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationIdRef.current);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  const createStarfield = (scene) => {
    const starCount = 3000; // Increased star count for larger space
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 3000;
      positions[i + 1] = (Math.random() - 0.5) * 3000;
      positions[i + 2] = (Math.random() - 0.5) * 3000;

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
    // Use the fixed planet distances for orbits
    const orbits = Object.values(planetDistances);
    const orbitalMaterial = new THREE.LineBasicMaterial({
      color: 0x444477,
      transparent: true,
      opacity: 0.1,
    });

    orbits.forEach((radius) => {
      const orbitGeometry = new THREE.RingGeometry(
        radius - 0.05,
        radius + 0.05,
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
      const planetSize = planetSizes[key] || data.radius;
      const orbitRadius = planetDistances[key] || data.orbitRadius;
      const orbitSpeed = orbitSpeeds[key] || data.orbitSpeed;

      // For Sun, load GLB model
      if (key === "sun") {
        loader.load(
          "/models/sun.glb",
          (gltf) => {
            const model = gltf.scene;
            const scale = planetSize / 3;
            model.scale.set(scale, scale, scale);
            model.position.set(0, 0, 0);

            model.userData = {
              planet: key,
              type: "star",
              rotationSpeed: 0.002, // Slower rotation
            };

            // Add solar corona glow
            const coronaGeometry = new THREE.SphereGeometry(
              planetSize * 1.15,
              32,
              32
            );
            const coronaMaterial = new THREE.MeshBasicMaterial({
              color: 0xff4500,
              transparent: true,
              opacity: 0.2,
              side: THREE.BackSide,
            });
            const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
            model.add(corona);

            scene.add(model);
            planetsRef.current.push(model);
            planetObjectsRef.current[key] = model;
            loadedCount++;
            if (loadedCount === totalPlanets) {
              setLoading(false);
            }
          },
          undefined,
          (error) => {
            console.error("Error loading sun model:", error);
            // Fallback to geometric sphere
            const geometry = new THREE.SphereGeometry(planetSize, 64, 64);
            const material = new THREE.MeshBasicMaterial({
              color: data.color || 0xff6b35,
              emissive: data.emissive || data.color || 0xff4500,
              emissiveIntensity: 0.8,
            });
            const planet = new THREE.Mesh(geometry, material);
            planet.position.set(0, 0, 0);
            planet.userData = {
              planet: key,
              type: "star",
              rotationSpeed: 0.002,
            };
            scene.add(planet);
            planetsRef.current.push(planet);
            planetObjectsRef.current[key] = planet;
            loadedCount++;
            if (loadedCount === totalPlanets) {
              setLoading(false);
            }
          }
        );
        return;
      }

      // Try to load GLB model for other planets
      if (data.modelPath) {
        loader.load(
          data.modelPath,
          (gltf) => {
            const model = gltf.scene;
            const scale = planetSize / 2;
            model.scale.set(scale, scale, scale);
            model.position.set(orbitRadius, 0, 0);

            // Enable shadows
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // Ensure materials are properly set up
                if (child.material) {
                  child.material.roughness = 0.7;
                  child.material.metalness = 0.3;
                }
              }
            });

            model.userData = {
              planet: key,
              type: "planet",
              orbitRadius: orbitRadius,
              orbitSpeed: orbitSpeed,
              rotationSpeed: data.rotationSpeed || 0.01,
              isGLBModel: true,
            };

            scene.add(model);
            planetsRef.current.push(model);
            planetObjectsRef.current[key] = model;

            // Add special features
            addPlanetFeatures(key, model, {
              ...data,
              orbitRadius,
              radius: planetSize,
              orbitSpeed: orbitSpeed,
            });

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
            createFallbackPlanet(
              key,
              {
                ...data,
                orbitRadius,
                radius: planetSize,
                orbitSpeed: orbitSpeed,
              },
              scene
            );
            loadedCount++;
            if (loadedCount === totalPlanets) {
              setLoading(false);
            }
          }
        );
      } else {
        // No model path, use geometric sphere
        createFallbackPlanet(
          key,
          {
            ...data,
            orbitRadius,
            radius: planetSize,
            orbitSpeed: orbitSpeed,
          },
          scene
        );
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
    planet.castShadow = true;
    planet.receiveShadow = true;

    planet.userData = {
      planet: key,
      type: "planet",
      orbitRadius: data.orbitRadius,
      orbitSpeed: data.orbitSpeed,
      rotationSpeed: data.rotationSpeed || 0.01,
      isGLBModel: false,
    };

    scene.add(planet);
    planetsRef.current.push(planet);
    planetObjectsRef.current[key] = planet;

    addPlanetFeatures(key, planet, data);
  };

  const addPlanetFeatures = (key, planet, data) => {
    // Add moon to Earth using GLB model
    if (data.hasMoon) {
      const loader = new GLTFLoader();
      loader.load(
        "/models/moon.glb",
        (gltf) => {
          const moon = gltf.scene;
          const moonSize = data.radius * 0.2;
          moon.scale.set(moonSize, moonSize, moonSize);
          moon.position.set(data.radius * 2, 0, 0);
          moon.userData = {
            type: "moon",
            orbitRadius: data.radius * 2,
            orbitSpeed: 0.05,
            rotationSpeed: 0.01,
          };
          planet.add(moon);
          moonsRef.current.push({ moon, planet });
        },
        undefined,
        (error) => {
          console.error("Error loading moon model:", error);
          // Fallback to geometric sphere
          const moonGeometry = new THREE.SphereGeometry(
            data.radius * 0.2,
            16,
            16
          );
          const moonMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.8,
          });
          const moon = new THREE.Mesh(moonGeometry, moonMaterial);
          moon.position.set(data.radius * 2, 0, 0);
          moon.userData = {
            type: "moon",
            orbitRadius: data.radius * 2,
            orbitSpeed: 0.05,
            rotationSpeed: 0.01,
          };
          planet.add(moon);
          moonsRef.current.push({ moon, planet });
        }
      );
    }

    // Add rings to Saturn (only for fallback geometric model)
    if (data.hasRings && !planet.userData.isGLBModel) {
      const ringGeometry = new THREE.RingGeometry(
        data.radius * 1.5,
        data.radius * 2.2,
        64
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffcc,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
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
    const cameraDistance =
      data.cameraDistance ||
      (planetName.toLowerCase() === "sun"
        ? 25
        : planetName.toLowerCase() === "jupiter" ||
          planetName.toLowerCase() === "saturn"
        ? 30
        : 20);

    const planetPosition = new THREE.Vector3();
    planet.getWorldPosition(planetPosition);

    const cameraPosition = new THREE.Vector3(
      planetPosition.x,
      planetPosition.y + cameraDistance * 0.5,
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
    if (
      !loading &&
      planetObjectsRef.current[exhibits[currentExhibit].name.toLowerCase()]
    ) {
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
