import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StickySpacecraft() {
  const [isVisible, setIsVisible] = useState(true); // Start visible from loading screen
  const [scrollProgress, setScrollProgress] = useState(0);
  const [phase, setPhase] = useState("entry"); // entry, traveling

  useEffect(() => {
    // Start as "entry" then transition to "traveling"
    const timer = setTimeout(() => {
      setPhase("traveling");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = currentScroll / totalScroll;
      setScrollProgress(progress);

      // Hide when reaching near bottom
      if (progress > 0.9) {
        setIsVisible(false);
      } else if (phase === "traveling") {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [phase]);

  if (!isVisible) return null;

  // Calculate dynamic position based on scroll
  const topPosition = phase === "entry" ? "50%" : `${15 + scrollProgress * 60}%`;
  const leftPosition = phase === "entry" ? "5%" : `${5 + Math.sin(scrollProgress * Math.PI * 3) * 40}%`;
  const rotation = phase === "entry" ? 0 : scrollProgress * 360;
  const scale = phase === "entry" ? 1.2 : 1 + scrollProgress * 0.4;

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      initial={{ x: -300, opacity: 0 }}
      animate={{
        x: 0,
        opacity: Math.max(0.6, 1 - scrollProgress * 0.5),
        top: topPosition,
        left: leftPosition,
        scale: scale,
        rotate: rotation,
      }}
      transition={{
        x: { duration: 2, ease: "easeOut" },
        opacity: { duration: 0.5 },
        top: { duration: 0.4, ease: "easeOut" },
        left: { duration: 0.6, ease: "easeInOut" },
        scale: { duration: 0.5 },
        rotate: { duration: 0.8, ease: "linear" },
      }}
    >
      <div className="relative">
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 blur-3xl rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.7) 0%, rgba(139,92,246,0.5) 40%, transparent 70%)",
            width: "400px",
            height: "400px",
            transform: "translate(-45%, -45%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Speed Lines */}
        {scrollProgress > 0.05 && (
          <div className="absolute -left-40 top-1/2 -translate-y-1/2">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-transparent mb-3"
                style={{
                  width: `${80 + i * 20}px`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scaleX: [0.6, 1.4, 0.6],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.08,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        {/* Spacecraft - Same design as loading screen */}
        <svg
          width="140"
          height="70"
          viewBox="0 0 120 60"
          className="drop-shadow-2xl relative z-10"
        >
          {/* Main Hull */}
          <path
            d="M 20 30 L 100 15 L 110 30 L 100 45 L 20 30 Z"
            fill="url(#spacecraft-gradient)"
            stroke="#06b6d4"
            strokeWidth="2"
          />

          {/* Cockpit Window */}
          <ellipse cx="90" cy="30" rx="15" ry="12" fill="#1e40af" opacity="0.8" />
          <ellipse cx="90" cy="30" rx="10" ry="8" fill="#3b82f6" opacity="0.6" />
          <ellipse cx="92" cy="28" rx="5" ry="4" fill="#60a5fa" opacity="0.9" />

          {/* Wings */}
          <path d="M 40 30 L 35 15 L 50 28 Z" fill="#4f46e5" opacity="0.9" />
          <path d="M 40 30 L 35 45 L 50 32 Z" fill="#4f46e5" opacity="0.9" />

          {/* Engine Glow - Animated */}
          <ellipse cx="22" cy="30" rx="10" ry="7" fill="#ec4899" opacity="0.8">
            <animate
              attributeName="rx"
              values="8;14;8"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </ellipse>

          {/* Detail Lines */}
          <line x1="30" y1="30" x2="95" y2="30" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
          <line x1="35" y1="25" x2="90" y2="20" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.4" />
          <line x1="35" y1="35" x2="90" y2="40" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.4" />

          <defs>
            <linearGradient id="spacecraft-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Engine Exhaust Trail */}
        <motion.div
          className="absolute right-full top-1/2 -translate-y-1/2 h-2"
          style={{
            background: "linear-gradient(to left, rgba(236, 72, 153, 0.9), rgba(139, 92, 246, 0.6), transparent)",
          }}
          animate={{
            width: [120, 220, 120],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Exhaust Particles */}
        <div className="absolute right-full top-1/2 -translate-y-1/2">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-orange-500"
              style={{
                left: `-${i * 20 + 10}px`,
                top: `${(Math.random() - 0.5) * 10}px`,
              }}
              animate={{
                x: [-10, -80],
                opacity: [1, 0],
                scale: [1, 0.3],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Mission Badge */}
        <motion.div
          className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <div className="relative">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />
            
            <div className="px-5 py-2 bg-black/80 backdrop-blur-md border border-cyan-400/60 rounded">
              <div className="text-xs font-bold text-cyan-300 tracking-wider mb-0.5">
                EXPLORER-1
              </div>
              <div className="text-[9px] text-cyan-400/80 font-mono tracking-wide">
                DEEP SPACE MISSION
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
