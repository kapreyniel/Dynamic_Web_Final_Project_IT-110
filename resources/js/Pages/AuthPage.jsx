import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaRocket } from 'react-icons/fa';
import axios from 'axios';

export default function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(endpoint, payload);

      if (response.status === 200 || response.status === 201) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user || { email: formData.email }));
        localStorage.setItem('authenticated', 'true');
        
        // Call success callback
        if (onAuthSuccess) {
          onAuthSuccess(response.data.user || { email: formData.email });
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(
        err.response?.data?.message ||
        'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Allow guest access
    const guestUser = { name: 'Guest', email: 'guest@beyond-earth.space', isGuest: true };
    localStorage.setItem('user', JSON.stringify(guestUser));
    localStorage.setItem('authenticated', 'true');
    if (onAuthSuccess) {
      onAuthSuccess(guestUser);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-space-dark via-black to-space-dark overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
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
                    ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-md transition-all ${
                  !isLogin
                    ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white'
                    : 'text-white/50 hover:text-white'
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
                    animate={{ opacity: 1, height: 'auto' }}
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
                    animate={{ opacity: 1, height: 'auto' }}
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
                {loading ? 'Processing...' : isLogin ? 'Launch Mission' : 'Join Expedition'}
              </motion.button>
            </form>

            {/* Skip/Guest Access */}
            <div className="mt-6 text-center">
              <button
                onClick={handleSkip}
                className="text-white/50 hover:text-cosmic-pink transition-colors text-sm"
              >
                Continue as Guest →
              </button>
            </div>
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
