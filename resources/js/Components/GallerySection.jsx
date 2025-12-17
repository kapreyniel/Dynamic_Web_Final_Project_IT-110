import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaTimes } from "react-icons/fa";
import axios from "axios";

export default function GallerySection({
  apodData,
  loading,
  onFavoriteAdded,
  favoriteIds = [],
  onAddFavorite = () => {},
  onLoadMore = () => {},
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [savingFavorite, setSavingFavorite] = useState(null);
  const [localFavoritedIds, setLocalFavoritedIds] = useState(favoriteIds || []);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLocalFavoritedIds(favoriteIds || []);
  }, [favoriteIds]);

  const handleFavorite = async (item) => {
    // Prevent adding if already favorited (local optimistic list)
    if (localFavoritedIds.includes(item.date)) {
      alert("Already in your favorites!");
      return;
    }

    // Optimistic update: add to local favorited ids so UI updates instantly
    setSavingFavorite(item.date);
    setLocalFavoritedIds((prev) => [...prev, item.date]);

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

      // If server returns a favorite object, add it to parent full list
      if (response.data && response.data.favorite) {
        // If newly created (201) show a toast
        if (response.status === 201) {
          alert("✨ Added to your favorites!");
        }
        // inform parent to include the full favorite record
        onAddFavorite(response.data.favorite);
      }

      // Trigger favorites section refresh in parent
      if (onFavoriteAdded) onFavoriteAdded();
    } catch (error) {
      console.error("Error saving favorite:", error);
      // rollback optimistic update
      setLocalFavoritedIds((prev) => prev.filter((id) => id !== item.date));
      alert("Error saving favorite. Please try again.");
    } finally {
      setSavingFavorite(null);
    }
  };

  const isFavorited = (date) => localFavoritedIds.includes(date);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      await onLoadMore();
    } catch (error) {
      console.error("Error loading more images:", error);
      alert("Failed to load more images. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

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

  // Check if we have data - handle both empty array and undefined
  const hasValidData =
    apodData && Array.isArray(apodData) && apodData.length > 0;

  if (!hasValidData) {
    return (
      <section id="gallery" className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8"
            >
              <div className="text-6xl mb-4">🔭</div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                Loading Gallery Images
              </h3>
              <p className="text-white/70 mb-4">
                {apodData === null || apodData === undefined
                  ? "Fetching images from NASA's Astronomy Picture of the Day..."
                  : "Unable to load images at the moment. Please refresh the page or try again later."}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-lg font-semibold hover:shadow-lg hover:shadow-cosmic-purple/50 transition-all"
              >
                Refresh Page
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="gallery"
      className="relative py-32 bg-gradient-to-b from-space-dark to-black/50 overflow-hidden"
    >
      {/* Cosmic Background with Stardust Fall Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cosmic-pink/10 rounded-full filter blur-3xl animate-nebula-swirl" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cosmic-blue/10 rounded-full filter blur-3xl animate-nebula-swirl"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header with Star Twinkle */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 animate-aurora-wave"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 gradient-text animate-glow-pulse">
            Cosmic Gallery
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto animate-cosmic-drift">
            A curated collection of breathtaking images from across the
            universe, captured by NASA's most advanced instruments.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 ${
            loadingMore ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {apodData.map((item, index) => (
            <motion.div
              key={item.date}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card overflow-hidden cursor-pointer group animate-glow-pulse hover:animate-planet-pulse"
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
                  disabled={
                    isFavorited(item.date) || savingFavorite === item.date
                  }
                  className={`flex items-center space-x-2 ${
                    isFavorited(item.date)
                      ? "text-cosmic-pink"
                      : "text-white/50 hover:text-cosmic-pink"
                  } transition-colors ${
                    savingFavorite === item.date ? "opacity-50" : ""
                  }`}
                >
                  <FaHeart
                    className={isFavorited(item.date) ? "fill-current" : ""}
                  />
                  <span className="text-sm">
                    {savingFavorite === item.date
                      ? "Saving..."
                      : isFavorited(item.date)
                      ? "Favorited"
                      : "Add to Favorites"}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center relative"
        >
          {loadingMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center rounded-lg"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-cosmic-purple border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-sm font-semibold">
                  Refreshing Gallery...
                </p>
              </div>
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: loadingMore ? 1 : 1.05 }}
            whileTap={{ scale: loadingMore ? 1 : 0.95 }}
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cosmic-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>🔭 See More</span>
            )}
          </motion.button>
        </motion.div>
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
