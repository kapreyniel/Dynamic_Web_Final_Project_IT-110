import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaSignOutAlt, FaUser, FaGoogle } from "react-icons/fa";
import axios from "axios";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
  }, []);

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
            {["Story", "Gallery", "Mars", "Earth", "Favorites"].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-white/80 hover:text-white font-medium transition-colors"
              >
                {item}
              </motion.button>
            ))}

            {/* User Avatar & Dropdown */}
            {user && (
              <div className="relative pl-4 border-l border-white/20" ref={dropdownRef}>
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
                      <div className="p-4 border-b border-white/10">
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
                      </div>

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
    </motion.nav>
  );
}
