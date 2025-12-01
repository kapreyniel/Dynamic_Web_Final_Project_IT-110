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

      {/* Main Content - Delayed to allow spacecraft landing animation */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1 }} // 1s delay for spacecraft landing
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </motion.div>
    </div>
  );
}
