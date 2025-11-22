import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function SolarSystemUI({
  currentExhibit,
  exhibitInfo,
  onNext,
  onPrevious,
  onCloseInfo,
  canGoPrevious,
  canGoNext,
}) {
  return (
    <>
      {/* Progress Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cosmic-purple to-cosmic-pink"
            initial={{ width: 0 }}
            animate={{ width: `${currentExhibit.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Current Planet Name */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <motion.div
          key={currentExhibit.name}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20"
        >
          <span className="text-white font-bold text-lg">
            {currentExhibit.name}
          </span>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
        >
          <FaChevronLeft />
          Previous
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          disabled={!canGoNext}
          className="px-6 py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-lg text-white font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cosmic-purple/50 transition-all"
        >
          Next
          <FaChevronRight />
        </motion.button>
      </div>

      {/* Exhibit Info Panel */}
      <AnimatePresence>
        {exhibitInfo && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-24 right-4 max-w-md"
          >
            <div className="bg-gradient-to-br from-gray-900/95 via-purple-900/95 to-gray-900/95 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-white gradient-text">
                  {exhibitInfo.title}
                </h3>
                <button
                  onClick={onCloseInfo}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <FaTimes className="text-white" />
                </button>
              </div>
              <p className="text-white/80 leading-relaxed">
                {exhibitInfo.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="text-white/70 text-sm text-center"
        >
          Use mouse to explore • Arrow keys or buttons to navigate
        </motion.div>
      </div>
    </>
  );
}
