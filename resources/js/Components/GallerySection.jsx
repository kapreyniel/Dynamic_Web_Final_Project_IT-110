import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaTimes } from "react-icons/fa";
import axios from "axios";

export default function GallerySection({ apodData, loading }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const handleFavorite = async (item) => {
    try {
      const response = await axios.post("/favorites", {
        item_type: "apod",
        item_id: item.date,
        title: item.title,
        image_url: item.url,
        description: item.explanation,
        metadata: JSON.stringify({
          date: item.date,
          media_type: item.media_type,
        }),
      });

      if (response.status === 201) {
        setFavorites([...favorites, item.date]);
      }
    } catch (error) {
      console.error("Error saving favorite:", error);
    }
  };

  const isFavorited = (date) => favorites.includes(date);

  if (loading) {
    return (
      <section id="gallery" className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-cosmic-purple border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-white/70">Loading cosmic wonders...</p>
          </div>
        </div>
      </section>
    );
  }

  // Check if we have data
  if (!apodData || apodData.length === 0) {
    return (
      <section id="gallery" className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-white/70">No images available. Please check your NASA API connection.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="gallery"
      className="relative py-32 bg-gradient-to-b from-space-dark to-black/50"
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
            Cosmic Gallery
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            A curated collection of breathtaking images from across the
            universe, captured by NASA's most advanced instruments.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apodData.map((item, index) => (
            <motion.div
              key={item.date}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card overflow-hidden cursor-pointer group"
            >
              {/* Image */}
              <div
                className="relative h-64 overflow-hidden rounded-lg mb-4"
                onClick={() => setSelectedImage(item)}
              >
                {item.media_type === "image" ? (
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cosmic-purple to-cosmic-blue flex items-center justify-center">
                    <span className="text-white text-lg">Video Content</span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm">{item.date}</span>
                </div>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm mb-4 line-clamp-3">
                  {item.explanation}
                </p>

                {/* Favorite Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleFavorite(item)}
                  className={`flex items-center space-x-2 ${
                    isFavorited(item.date)
                      ? "text-cosmic-pink"
                      : "text-white/50 hover:text-cosmic-pink"
                  } transition-colors`}
                >
                  <FaHeart
                    className={isFavorited(item.date) ? "fill-current" : ""}
                  />
                  <span className="text-sm">
                    {isFavorited(item.date) ? "Favorited" : "Add to Favorites"}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl w-full glass-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
              >
                <FaTimes className="text-2xl" />
              </button>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  {selectedImage.media_type === "image" ? (
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <iframe
                      src={selectedImage.url}
                      className="w-full h-full min-h-[400px] rounded-lg"
                      frameBorder="0"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="overflow-y-auto max-h-[600px]">
                  <h2 className="text-3xl font-bold mb-4">
                    {selectedImage.title}
                  </h2>
                  <p className="text-sm text-white/50 mb-6">
                    {selectedImage.date}
                  </p>
                  <p className="text-white/80 leading-relaxed">
                    {selectedImage.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
