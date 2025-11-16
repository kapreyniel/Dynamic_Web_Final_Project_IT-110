import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaSignOutAlt, FaUser } from 'react-icons/fa';
import axios from 'axios';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSignOut = async () => {
        try {
            // Call logout API
            await axios.post('/logout');
            
            // Clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('authenticated');
            
            // Reload page to show auth screen
            window.location.reload();
        } catch (error) {
            console.error('Sign out error:', error);
            // Clear localStorage anyway
            localStorage.removeItem('user');
            localStorage.removeItem('authenticated');
            window.location.reload();
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-space-dark/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => scrollToSection('hero')}
                    >
                        <FaRocket className="text-cosmic-purple text-2xl" />
                        <span className="font-display text-2xl font-bold gradient-text">
                            Beyond Earth
                        </span>
                    </motion.div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {['Story', 'Gallery', 'Mars', 'Earth', 'Favorites'].map((item) => (
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
                        
                        {/* User Info & Sign Out */}
                        {user && !user.isGuest && (
                            <div className="flex items-center space-x-4 pl-4 border-l border-white/20">
                                <div className="flex items-center space-x-2 text-white/70">
                                    <FaUser className="text-sm" />
                                    <span className="text-sm">{user.name}</span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSignOut}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-colors"
                                    title="Sign Out"
                                >
                                    <FaSignOutAlt />
                                    <span className="text-sm font-medium">Sign Out</span>
                                </motion.button>
                            </div>
                        )}
                        
                        {/* Guest Badge */}
                        {user && user.isGuest && (
                            <div className="flex items-center space-x-2 pl-4 border-l border-white/20 text-cyan-300/70">
                                <FaUser className="text-sm" />
                                <span className="text-sm">Guest Mode</span>
                            </div>
                        )}
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => scrollToSection('feedback')}
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
