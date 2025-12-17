import React from "react";
import { motion } from "framer-motion";
import { FaRocket, FaArrowDown } from "react-icons/fa";

export default function Hero() {
  const scrollToStory = () => {
    const element = document.getElementById("story");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Gradient Overlay with Cosmic Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-dark/50 to-space-dark z-0 animate-cosmic-shimmer" />

      {/* Cosmic Background Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cosmic-purple/10 rounded-full filter blur-3xl animate-nebula-swirl" />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cosmic-pink/10 rounded-full filter blur-3xl animate-nebula-swirl"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Animated Badge with Glow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8 animate-glow-pulse"
          >
            <FaRocket className="text-cosmic-purple animate-cosmic-drift" />
            <span className="text-sm text-white/80">Powered by NASA API</span>
          </motion.div>

          {/* Main Heading with Aurora Effect */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-display font-bold mb-6 leading-tight animate-aurora-wave"
          >
            <span className="gradient-text">Beyond Earth</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed animate-cosmic-drift"
          >
            Embark on a cinematic journey through the cosmos. Experience
            humanity's greatest adventure through stunning imagery and real-time
            data from NASA's exploration missions.
          </motion.p>

          {/* CTA Buttons with Planet Pulse */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToStory}
              className="btn-primary text-lg px-8 py-4 animate-planet-pulse"
            >
              Begin Journey
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                document
                  .getElementById("gallery")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="btn-secondary text-lg px-8 py-4 animate-glow-pulse"
            >
              Explore Gallery
            </motion.button>
          </motion.div>

          {/* Floating Animation with Star Twinkle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={scrollToStory}
              className="cursor-pointer animate-star-twinkle"
            >
              <FaArrowDown className="text-white/50 text-3xl" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Planets - Decorative with Orbit Animation */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-cosmic-purple to-cosmic-blue rounded-full opacity-20 blur-2xl animate-planet-pulse"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-40 left-10 w-40 h-40 bg-gradient-to-br from-cosmic-pink to-cosmic-purple rounded-full opacity-20 blur-2xl animate-glow-pulse"
      />
    </section>
  );
}
