import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaRocket, FaGoogle } from "react-icons/fa";
import axios from "axios";

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/login" : "/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(endpoint, payload);

      if (response.status === 200 || response.status === 201) {
        // Store user data in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user || { email: formData.email })
        );
        localStorage.setItem("authenticated", "true");

        // Call success callback
        if (onAuthSuccess) {
          onAuthSuccess(response.data.user || { email: formData.email });
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.response?.data?.message ||
          "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/auth/google";
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900 overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 z-0">
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Animated Planet Background */}
      <motion.div
        className="absolute right-0 top-0 w-[600px] h-[600px] -translate-y-1/4 translate-x-1/4 z-10"
        initial={{ scale: 3, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 0.5,
          rotate: 360,
        }}
        transition={{
          scale: { duration: 1.5, ease: "easeOut" },
          opacity: { duration: 1.2 },
          rotate: { duration: 100, repeat: Infinity, ease: "linear" },
        }}
      >
        <div className="relative w-full h-full">
          {/* Planet Core Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 via-purple-500 to-pink-500 blur-3xl opacity-80" />

          {/* Planet Surface */}
          <div className="absolute inset-12 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-purple-700 overflow-hidden shadow-2xl">
            {/* Atmosphere Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/50 via-transparent to-transparent" />

            {/* Surface Details */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-red-900/50"
                  style={{
                    width: `${Math.random() * 40 + 15}%`,
                    height: `${Math.random() * 40 + 15}%`,
                    left: `${Math.random() * 60}%`,
                    top: `${Math.random() * 60}%`,
                  }}
                />
              ))}
            </motion.div>

            {/* Cloud Layer */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/10 blur-sm"
                  style={{
                    width: `${Math.random() * 30 + 20}%`,
                    height: `${Math.random() * 20 + 10}%`,
                    left: `${Math.random() * 70}%`,
                    top: `${Math.random() * 70}%`,
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Planetary Rings */}
          <div
            className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: "translateX(-50%) translateY(-50%) rotateX(75deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="w-full h-full rounded-full border-8 border-purple-400/30 blur-sm" />
            <div className="absolute inset-8 rounded-full border-6 border-pink-400/20 blur-sm" />
          </div>
        </div>
      </motion.div>

      {/* Smaller orbiting moon/asteroid */}
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-gray-300 via-gray-500 to-gray-700 opacity-40 z-10"
        style={{
          right: "15%",
          top: "25%",
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: 360,
        }}
        transition={{
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
      >
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-400 to-gray-800" />
      </motion.div>

      <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaRocket className="text-6xl text-cosmic-pink mx-auto mb-4" />
            <h1 className="text-5xl font-display font-bold gradient-text mb-2">
              Beyond Earth
            </h1>
            <p className="text-white/70">Journey Through Space</p>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            className="glass-card p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Toggle Login/Register */}
            <div className="flex mb-6 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-md transition-all ${
                  isLogin
                    ? "bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-md transition-all ${
                  !isLogin
                    ? "bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cosmic-purple transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cosmic-purple transition-all"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cosmic-purple transition-all"
                />
              </div>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                      <input
                        type="password"
                        name="password_confirmation"
                        placeholder="Confirm Password"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cosmic-purple transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cosmic-purple/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : isLogin
                  ? "Launch Mission"
                  : "Join Expedition"}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/50">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-3"
            >
              <FaGoogle className="text-xl" />
              <span>Sign in with Google</span>
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6 text-white/50 text-sm"
          >
            Embark on your cosmic journey
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
