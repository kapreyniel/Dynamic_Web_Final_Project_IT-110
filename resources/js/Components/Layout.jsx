import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import StarField from "./StarField";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated Star Background */}
      <StarField />

      {/* Main Content */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </motion.div>
    </div>
  );
}
