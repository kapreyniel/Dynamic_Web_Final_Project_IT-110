import React, { Suspense } from "react";
import { motion } from "framer-motion";
import SolarSystemViewer from "./SolarSystemViewer";

export default function InteractiveEarth({ epicImages, loading }) {
  return (
    <section
      id="earth"
      className="relative py-32 bg-gradient-to-b from-black/50 to-space-dark"
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 gradient-text">
            Explore Our Solar System
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Journey through our cosmic neighborhood with an interactive 3D
            experience. Navigate through planets, from the scorching Sun to
            distant Pluto, and discover the wonders of our solar system.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Solar System Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card h-[600px] overflow-hidden"
          >
            <Suspense
              fallback={
                <div className="h-full flex items-center justify-center">
                  <div className="text-white/70">Loading Solar System...</div>
                </div>
              }
            >
              <SolarSystemViewer />
            </Suspense>
          </motion.div>

          {/* Solar System Facts */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold mb-6">Discover the Cosmos</h3>

            {[
              {
                title: "Our Star System",
                description:
                  "The Solar System formed 4.6 billion years ago from a giant molecular cloud. Eight planets orbit our Sun, each with unique characteristics and mysteries.",
              },
              {
                title: "Planetary Diversity",
                description:
                  "From rocky terrestrial planets to massive gas giants, each world offers unique environments—from Venus's toxic atmosphere to Saturn's magnificent rings.",
              },
              {
                title: "Journey of Discovery",
                description:
                  "Space missions have revealed stunning details about our cosmic neighbors. Explore each planet interactively and learn what makes them extraordinary.",
              },
            ].map((fact, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 10 }}
                className="glass-card"
              >
                <h4 className="text-xl font-bold mb-2 text-cosmic-cyan">
                  {fact.title}
                </h4>
                <p className="text-white/70">{fact.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* EPIC Images Gallery */}
        {!loading && epicImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-20"
          >
            <h3 className="text-3xl font-bold text-center mb-12">
              Earth from a Million Miles Away
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {epicImages.slice(0, 5).map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square overflow-hidden rounded-lg glass-card p-2"
                >
                  <img
                    src={image.image_url}
                    alt={`Earth - ${image.date}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
