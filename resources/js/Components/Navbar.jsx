import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePage } from "@inertiajs/react";
import {
  FaRocket,
  FaSignOutAlt,
  FaUser,
  FaGoogle,
  FaTimes,
  FaEnvelope,
  FaIdCard,
} from "react-icons/fa";
import axios from "axios";

export default function Navbar() {
  const { props } = usePage();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Get user from Inertia props (passed from backend)
    const authenticatedUser = props?.auth?.user;
    if (authenticatedUser) {
      setUser(authenticatedUser);
      // Also store in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(authenticatedUser));
      localStorage.setItem("authenticated", "true");
    } else {
      // Fallback to localStorage if not in props
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props?.auth?.user]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSignOut = async () => {
    try {
      // Call logout API
      await axios.post("/logout");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("authenticated");

      // Redirect to home page (which will trigger auth flow)
      window.location.href = "/";
    }
  };

  const openProfileModal = () => {
    setShowDropdown(false);
    setShowProfileModal(true);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-space-dark/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <FaRocket className="text-cosmic-purple text-2xl" />
            <span className="font-display text-2xl font-bold gradient-text">
              Beyond Earth
            </span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { label: "Story", id: "story" },
              { label: "Gallery", id: "gallery" },
              { label: "Solar System", id: "earth" },
              { label: "Mars", id: "mars" },
              { label: "Favorites", id: "favorites" },
            ].map((item) => (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.id)}
                className="text-white/80 hover:text-white font-medium transition-colors"
              >
                {item.label}
              </motion.button>
            ))}

            {/* User Avatar & Dropdown */}
            {user && (
              <div
                className="relative pl-4 border-l border-white/20"
                ref={dropdownRef}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  {/* Avatar */}
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-cosmic-purple shadow-lg"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cosmic-purple to-cosmic-pink flex items-center justify-center border-2 border-cosmic-purple shadow-lg">
                      <FaUser className="text-white text-lg" />
                    </div>
                  )}

                  {/* User Name */}
                  <span className="text-white/90 font-medium hidden lg:block">
                    {user.name}
                  </span>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                      {/* User Info Section */}
                      <button
                        onClick={openProfileModal}
                        className="w-full p-4 border-b border-white/10 hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-12 h-12 rounded-full border-2 border-cosmic-purple"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cosmic-purple to-cosmic-pink flex items-center justify-center">
                              <FaUser className="text-white text-xl" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">
                              {user.name}
                            </p>
                            <p className="text-white/60 text-sm truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Google Badge */}
                        {user.google_id && (
                          <div className="flex items-center space-x-2 mt-2 px-3 py-1.5 bg-white/5 rounded-lg">
                            <FaGoogle className="text-red-400 text-sm" />
                            <span className="text-white/70 text-xs">
                              Connected with Google
                            </span>
                          </div>
                        )}
                        <p className="text-cyan-400 text-xs mt-2 text-center">
                          Click to view full profile
                        </p>
                      </button>

                      {/* Sign Out Button */}
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-500/10 transition-colors group"
                      >
                        <FaSignOutAlt className="text-red-400 group-hover:text-red-300 transition-colors" />
                        <span className="text-red-400 group-hover:text-red-300 font-medium transition-colors">
                          Sign Out
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("feedback")}
              className="btn-primary"
            >
              Join Mission
            </motion.button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/50 border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Header */}
              <div className="relative p-6 bg-gradient-to-r from-cosmic-purple to-cosmic-pink">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <FaTimes className="text-white text-xl" />
                </button>

                <div className="flex items-center space-x-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-xl">
                      <FaUser className="text-white text-3xl" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {user.name}
                    </h2>
                    <p className="text-white/80 text-sm">Astronaut Explorer</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* Email */}
                <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <FaEnvelope className="text-cosmic-pink text-xl mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                      Email Address
                    </p>
                    <p className="text-white font-medium break-all">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* User ID */}
                <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <FaIdCard className="text-cosmic-purple text-xl mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                      User ID
                    </p>
                    <p className="text-white font-medium font-mono">
                      #{user.id}
                    </p>
                  </div>
                </div>

                {/* Google Account */}
                {user.google_id && (
                  <div className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <FaGoogle className="text-red-400 text-xl mt-0.5" />
                    <div className="flex-1">
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                        Google Account
                      </p>
                      <p className="text-white font-medium">Connected</p>
                      <p className="text-white/50 text-xs mt-1">
                        ID: {user.google_id}
                      </p>
                    </div>
                  </div>
                )}

                {/* Account Status */}
                <div className="flex items-start space-x-3 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="w-3 h-3 bg-green-400 rounded-full mt-1.5 shadow-lg shadow-green-400/50"></div>
                  <div className="flex-1">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                      Account Status
                    </p>
                    <p className="text-green-400 font-medium">
                      Active & Verified
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-white/5 border-t border-white/10">
                <p className="text-white/50 text-xs text-center">
                  Member of Beyond Earth Space Exploration Team
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
