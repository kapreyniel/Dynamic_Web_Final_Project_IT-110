import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaStar, FaSpaceShuttle, FaGlobeAmericas } from "react-icons/fa";

export default function StoryTimeline({ apodData, loading }) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 1, 1]);

  const timelineSteps = [
    {
      icon: FaStar,
      title: "The Dawn of Exploration",
      description:
        "From ancient stargazers to modern astronomers, humanity has always looked up in wonder.",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: FaSpaceShuttle,
      title: "The Space Age Begins",
      description:
        "Breaking free from Earth's gravity, we ventured into the unknown, reaching for the stars.",
      color: "from-blue-400 to-purple-500",
    },
    {
      icon: FaGlobeAmericas,
      title: "A New Perspective",
      description:
        "Seeing Earth from space changed everything. We're one planet, one humanity, one destiny.",
      color: "from-green-400 to-cyan-500",
    },
  ];

  return (
    <section
      id="story"
      className="relative py-12 md:py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-space-dark/50 to-space-dark"
    >
      {/* Cosmic Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-blue/10 rounded-full filter blur-3xl animate-nebula-swirl" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic-purple/10 rounded-full filter blur-3xl animate-nebula-swirl"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        {/* Section Header with Aurora Effect */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20 animate-aurora-wave"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3 md:mb-6 gradient-text px-2 animate-glow-pulse">
            Our Journey Through Time
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 max-w-3xl mx-auto px-2 animate-cosmic-drift">
            Every image tells a story. Every mission reveals a truth. This is
            humanity's adventure beyond the blue horizon.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Center Line with Cosmic Shimmer - Hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cosmic-purple via-cosmic-blue to-transparent animate-cosmic-shimmer" />

          {/* Timeline Steps */}
          {timelineSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative mb-8 md:mb-20 flex items-center flex-col md:flex-row animate-planet-pulse ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Content */}
              <div
                className={`w-full md:w-5/12 ${
                  index % 2 === 0
                    ? "md:text-right md:pr-12"
                    : "md:text-left md:pl-12"
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="glass-card p-4 md:p-6"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r ${step.color} mb-3 md:mb-4`}
                  >
                    <step.icon className="text-white text-lg md:text-2xl" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-base text-white/70">
                    {step.description}
                  </p>
                </motion.div>
              </div>

              {/* Center Dot */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-blue border-4 border-space-dark" />
              <div className="md:hidden w-6 h-6 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-blue border-4 border-space-dark my-4" />

              {/* Spacer */}
              <div className="hidden md:block md:w-5/12" />
            </motion.div>
          ))}
        </div>

        {/* Featured APOD */}
        {!loading && apodData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-12 md:mt-20 lg:mt-32"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-center mb-6 md:mb-12 gradient-text px-2">
              Today's Cosmic Wonder
            </h3>
            <div className="glass-card max-w-4xl mx-auto overflow-hidden p-4 md:p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="relative overflow-hidden rounded-lg group h-48 md:h-full">
                  {apodData[0].media_type === "image" ? (
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={apodData[0].url}
                      alt={apodData[0].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <iframe
                      src={apodData[0].url}
                      className="w-full h-full min-h-[250px] md:min-h-[300px]"
                      frameBorder="0"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">
                    {apodData[0].title}
                  </h4>
                  <p className="text-xs md:text-base text-white/70 mb-2 md:mb-4">
                    {apodData[0].explanation?.substring(0, 300)}...
                  </p>
                  <p className="text-xs text-white/50">{apodData[0].date}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
