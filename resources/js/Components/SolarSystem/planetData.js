export const planetData = {
  sun: {
    name: "The Sun",
    description:
      "Our star - a massive ball of hot plasma that provides energy for our solar system. Diameter: 1.39 million km, Surface Temperature: 5,500°C",
    radius: 8,
    color: 0xff4500,
    emissive: 0xff0000,
    cameraDistance: 20,
  },
  mercury: {
    name: "Mercury",
    description:
      "The smallest and innermost planet. No atmosphere, extreme temperatures (430°C to -180°C). Orbital period: 88 days.",
    radius: 0.8,
    color: 0x888888,
    orbitRadius: 12,
    orbitSpeed: 0.04,
    cameraDistance: 8,
  },
  venus: {
    name: "Venus",
    description:
      "Earth's 'sister planet' with a toxic atmosphere of CO₂ and sulfuric acid clouds. Hottest planet due to greenhouse effect (465°C).",
    radius: 1.2,
    color: 0xffcc99,
    orbitRadius: 16,
    orbitSpeed: 0.015,
    cameraDistance: 10,
  },
  earth: {
    name: "Earth",
    description:
      "Our home - the only known planet with life. 71% water surface, protective atmosphere and magnetic field. One moon.",
    radius: 1.3,
    color: 0x4facfe,
    orbitRadius: 20,
    orbitSpeed: 0.01,
    cameraDistance: 12,
    hasMoon: true,
  },
  mars: {
    name: "Mars",
    description:
      "The Red Planet with iron oxide surface. Thin CO₂ atmosphere, polar ice caps, and the largest volcano Olympus Mons.",
    radius: 1.1,
    color: 0xff6b35,
    orbitRadius: 24,
    orbitSpeed: 0.005,
    cameraDistance: 10,
  },
  jupiter: {
    name: "Jupiter",
    description:
      "Largest planet - a gas giant with Great Red Spot storm. Has 79 moons including Ganymede, the largest moon in solar system.",
    radius: 3.0,
    color: 0xffcc99,
    orbitRadius: 32,
    orbitSpeed: 0.002,
    cameraDistance: 18,
  },
  saturn: {
    name: "Saturn",
    description:
      "Famous for its spectacular ring system. Gas giant with density lower than water - it would float! Has 82 moons.",
    radius: 2.5,
    color: 0xffe4b5,
    orbitRadius: 40,
    orbitSpeed: 0.001,
    cameraDistance: 22,
    hasRings: true,
  },
  uranus: {
    name: "Uranus",
    description:
      "Ice giant that rotates on its side. Pale blue from methane, has 13 faint rings and 27 moons. -224°C surface temperature.",
    radius: 1.8,
    color: 0xafeeee,
    orbitRadius: 48,
    orbitSpeed: 0.0007,
    cameraDistance: 16,
  },
  neptune: {
    name: "Neptune",
    description:
      "The windiest planet with speeds up to 2,100 km/h. Ice giant with Great Dark Spot storm. Has 14 moons.",
    radius: 1.8,
    color: 0x4169e1,
    orbitRadius: 56,
    orbitSpeed: 0.0004,
    cameraDistance: 16,
  },
  pluto: {
    name: "Pluto",
    description:
      "Dwarf planet in Kuiper Belt. Has a heart-shaped glacier and 5 moons including Charon. Surface: -229°C.",
    radius: 0.6,
    color: 0xdddddd,
    orbitRadius: 64,
    orbitSpeed: 0.0002,
    cameraDistance: 8,
  },
};
