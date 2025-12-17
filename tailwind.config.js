/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: "#0a0e27",
          blue: "#1e3a8a",
          purple: "#4c1d95",
          cyan: "#06b6d4",
        },
        cosmic: {
          pink: "#ec4899",
          purple: "#a855f7",
          blue: "#3b82f6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 1s ease-in",
        "slide-up": "slideUp 0.8s ease-out",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "nebula-swirl": "nebulaSwirl 8s ease-in-out infinite",
        orbit: "orbit 20s linear infinite",
        "star-twinkle": "starTwinkle 3s ease-in-out infinite",
        "aurora-wave": "auroraWave 4s ease-in-out infinite",
        "cosmic-drift": "cosmicDrift 6s ease-in-out infinite",
        "planet-pulse": "planetPulse 4s ease-in-out infinite",
        "stardust-fall": "stardustFall 8s ease-in infinite",
        "cosmic-shimmer": "cosmicShimmer 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow:
              "0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1)",
          },
          "50%": {
            boxShadow:
              "0 0 40px rgba(168, 85, 247, 0.6), inset 0 0 40px rgba(168, 85, 247, 0.2)",
          },
        },
        nebulaSwirl: {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.05)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(100px) rotate(0deg)" },
          "100%": {
            transform: "rotate(360deg) translateX(100px) rotate(-360deg)",
          },
        },
        starTwinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        auroraWave: {
          "0%, 100%": {
            transform: "translateY(0px) skewY(0deg)",
            opacity: "0.5",
          },
          "50%": { transform: "translateY(-10px) skewY(2deg)", opacity: "1" },
        },
        cosmicDrift: {
          "0%": { transform: "translateX(0px) translateY(0px)" },
          "50%": { transform: "translateX(20px) translateY(-10px)" },
          "100%": { transform: "translateX(0px) translateY(0px)" },
        },
        planetPulse: {
          "0%, 100%": {
            transform: "scale(1)",
            filter: "drop-shadow(0 0 20px rgba(236, 72, 153, 0.3))",
          },
          "50%": {
            transform: "scale(1.05)",
            filter: "drop-shadow(0 0 40px rgba(236, 72, 153, 0.6))",
          },
        },
        stardustFall: {
          "0%": { transform: "translateY(-10px) translateX(0)", opacity: "1" },
          "100%": {
            transform: "translateY(100vh) translateX(100px)",
            opacity: "0",
          },
        },
        cosmicShimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
