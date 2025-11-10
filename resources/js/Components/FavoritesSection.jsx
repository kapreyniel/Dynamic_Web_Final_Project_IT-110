import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaTrash, FaStar } from "react-icons/fa";
import axios from "axios";

export default function FavoritesSection({
  refreshTrigger,
  favoritesFull = [],
  setFavoritesFull = () => {},
}) {
  const [loading, setLoading] = useState(true);

  // If parent passes favoritesFull we use it; otherwise we could fetch, but parent now provides it
  useEffect(() => {
    setLoading(false);
  }, [favoritesFull, refreshTrigger]);

  const removeFavorite = async (id) => {
    try {
      await axios.delete(`/favorites/${id}`);
      setFavoritesFull((prev) => prev.filter((fav) => fav.id !== id));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <section
      id="favorites"
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
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-cosmic-pink/10 backdrop-blur-sm border border-cosmic-pink/20 rounded-full mb-6">
            <FaHeart className="text-cosmic-pink" />
            <span className="text-sm text-cosmic-pink">Your Collection</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 gradient-text">
            Saved Moments
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Your personal collection of cosmic wonders. Every favorite tells
            your unique story of exploration.
          </p>
        </motion.div>

        {/* Favorites Grid */}
        {loading ? (
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-cosmic-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favoritesFull.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center glass-card max-w-2xl mx-auto py-20"
          >
            <FaStar className="text-6xl text-white/20 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">No favorites yet</h3>
            <p className="text-white/60 mb-8">
              Start building your cosmic collection by adding images from our
              gallery!
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("gallery")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="btn-primary"
            >
              Explore Gallery
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {favoritesFull.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass-card overflow-hidden group"
                >
                  {/* Image */}
                  {favorite.image_url && (
                    <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                      <img
                        src={favorite.image_url}
                        alt={favorite.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      {favorite.title}
                    </h3>
                    {favorite.description && (
                      <p className="text-white/70 text-sm mb-4 line-clamp-3">
                        {favorite.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50">
                        {new Date(favorite.created_at).toLocaleDateString()}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFavorite(favorite.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
