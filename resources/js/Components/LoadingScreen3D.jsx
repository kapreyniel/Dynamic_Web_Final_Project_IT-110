import React, { useEffect, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Spline from "@splinetool/react-spline";

export default function LoadingScreen3D({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(
    "Initializing spacecraft systems..."
  );
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [phase, setPhase] = useState("travel"); // travel, approach, landing
  const [spacecraftPosition, setSpacecraftPosition] = useState(0);

  useEffect(() => {
    // Spacecraft travel animation - 5 seconds total journey
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
        setProgress(step.progress);
        setLoadingText(step.text);
        setPhase(step.phase);
        setSpacecraftPosition(step.progress);
        currentStep++;
        setTimeout(runStep, step.time);
      } else {
        setTimeout(() => {
          if (onLoadingComplete) onLoadingComplete();
        }, 500);
      }
    };

    runStep();
  }, [onLoadingComplete]);

  function onLoad(spline) {
    setSplineLoaded(true);
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Starfield Background */}
      <div className="absolute inset-0 z-10">
        {[...Array(200)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5],
              x: phase === "travel" ? [0, -100] : 0,
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Spline 3D Scene - Subtle Background */}
      <div className="absolute inset-0 z-0 opacity-15">
        <Suspense fallback={null}>
          <Spline
            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            onLoad={() => setSplineLoaded(true)}
            className="w-full h-full"
          />
        </Suspense>
      </div>

      {/* Destination Planet */}
      <motion.div
        className="absolute z-20"
        style={{
          right: phase === "landing" ? "50%" : "10%",
          top: phase === "landing" ? "50%" : "20%",
          transform: phase === "landing" ? "translate(50%, -50%)" : "translate(0, 0)",
        }}
        initial={{ scale: 0.3, opacity: 0.6 }}
        animate={{
          scale: phase === "landing" ? 3 : phase === "approach" ? 1.2 : 0.5,
          opacity: phase === "landing" ? 0.9 : 0.8,
          rotate: [0, 360],
        }}
        transition={{
          scale: { duration: 1.5, ease: "easeInOut" },
          opacity: { duration: 1 },
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
        }}
      >
        <div className="relative w-64 h-64">
          {/* Planet Core Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 blur-3xl opacity-90" />

          {/* Planet Surface */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-purple-700 overflow-hidden shadow-2xl">
            {/* Atmosphere Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/50 via-transparent to-transparent" />

            {/* Surface Details - Craters and Land */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-red-900/60"
                  style={{
                    width: `${Math.random() * 30 + 10}%`,
                    height: `${Math.random() * 30 + 10}%`,
                    left: `${Math.random() * 70}%`,
                    top: `${Math.random() * 70}%`,
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Rings */}
          <motion.div
            className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: "translateX(-50%) translateY(-50%) rotateX(75deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="w-80 h-80 rounded-full border-8 border-purple-400/50 shadow-lg" />
            <div className="absolute inset-4 rounded-full border-6 border-pink-400/40" />
          </motion.div>
        </div>
      </motion.div>

      {/* Spacecraft */}
      <motion.div
        className="absolute left-10 top-1/2 -translate-y-1/2 z-30"
        style={{
          x: `${spacecraftPosition * 8}vw`,
        }}
        animate={{
          y: phase === "landing" ? [0, -20, 0, -10, 0] : 0,
          rotate: phase === "landing" ? [0, -5, 5, -2, 0] : 0,
        }}
        transition={{
          y: phase === "landing" ? { duration: 2, ease: "easeInOut" } : {},
          rotate: phase === "landing" ? { duration: 2, ease: "easeInOut" } : {},
        }}
      >
        <div className="relative">
          {/* Spacecraft Body */}
          <svg
            width="120"
            height="60"
            viewBox="0 0 120 60"
            className="drop-shadow-2xl"
          >
            {/* Main Hull */}
            <path
              d="M 20 30 L 100 15 L 110 30 L 100 45 L 20 30 Z"
              fill="url(#spacecraft-gradient)"
              stroke="#06b6d4"
              strokeWidth="2"
            />
            {/* Cockpit */}
            <ellipse
              cx="90"
              cy="30"
              rx="15"
              ry="12"
              fill="#1e40af"
              opacity="0.7"
            />
            <ellipse
              cx="90"
              cy="30"
              rx="10"
              ry="8"
              fill="#3b82f6"
              opacity="0.5"
            />

            {/* Wings */}
            <path d="M 40 30 L 35 15 L 50 28 Z" fill="#4f46e5" opacity="0.8" />
            <path d="M 40 30 L 35 45 L 50 32 Z" fill="#4f46e5" opacity="0.8" />

            {/* Engine Glow */}
            <motion.ellipse
              cx="22"
              cy="30"
              rx="8"
              ry="6"
              fill="#ec4899"
              animate={{ opacity: [0.5, 1, 0.5], rx: [8, 12, 8] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />

            <defs>
              <linearGradient
                id="spacecraft-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Engine Trail */}
          {phase === "travel" && (
            <motion.div
              className="absolute right-full top-1/2 -translate-y-1/2 h-1 bg-gradient-to-l from-pink-500 via-purple-500 to-transparent"
              animate={{ width: [100, 200, 100], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}

          {/* Speed Lines */}
          {phase === "travel" && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute right-full top-1/2 h-0.5 bg-cyan-400"
                  style={{ top: `${30 + i * 8}%` }}
                  animate={{
                    width: [0, 150, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </>
          )}
        </div>
      </motion.div>

      {/* Asteroid Field */}
      <AnimatePresence>
        {phase === "travel" && progress > 20 && progress < 60 && (
          <>
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-gray-600"
                style={{
                  width: `${Math.random() * 30 + 10}px`,
                  height: `${Math.random() * 30 + 10}px`,
                  right: `${Math.random() * 50}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ x: 0, opacity: 1, rotate: 0 }}
                animate={{
                  x: [0, -800],
                  rotate: [0, 360],
                  opacity: [1, 0.5, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  delay: Math.random() * 0.5,
                  repeat: Infinity,
                }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-500 to-gray-700 shadow-lg" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Loading UI Overlay */}
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
              Beyond Earth Journey
            </p>
          </motion.div>

          {/* HUD Style Progress */}
          <div className="relative mb-6">
            {/* Progress Bar Container */}
            <div className="relative bg-black/70 backdrop-blur-md border-2 border-cyan-400/50 rounded-lg p-6 shadow-2xl">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

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

              {/* Progress Bar */}
              <div className="relative h-4 bg-gray-900/80 rounded-full overflow-hidden border border-cyan-500/50">
                <motion.div
                  className="h-full relative"
                  style={{
                    background:
                      "linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Scanning Line Effect */}
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
                  className="text-2xl font-bold font-mono"
                  style={{
                    background: "linear-gradient(90deg, #06b6d4, #ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  {progress}%
                </motion.span>
              </div>
            </div>
          </div>

          {/* Phase Indicators */}
          <div className="flex justify-center gap-4">
            {["LAUNCH", "TRAVEL", "APPROACH", "LANDING"].map((label, idx) => (
              <motion.div
                key={label}
                className={`px-3 py-1 rounded border ${
                  progress >= (idx + 1) * 25
                    ? "border-green-400 bg-green-400/20 text-green-300"
                    : "border-gray-600 bg-gray-900/40 text-gray-500"
                }`}
                animate={
                  progress >= (idx + 1) * 25
                    ? {
                        boxShadow: [
                          "0 0 10px rgba(74, 222, 128, 0.5)",
                          "0 0 20px rgba(74, 222, 128, 0.8)",
                          "0 0 10px rgba(74, 222, 128, 0.5)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-xs font-mono">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scan Lines Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400 to-transparent h-2"
          animate={{ y: [0, "100vh"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}
