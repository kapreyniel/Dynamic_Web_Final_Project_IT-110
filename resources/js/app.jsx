import "./bootstrap";
import "../css/app.css";

import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { AnimatePresence } from "framer-motion";
import LoadingScreen3D from "./Components/LoadingScreen3D";
import AuthPage from "./Pages/AuthPage";

const appName = import.meta.env.VITE_APP_NAME || "Beyond Earth";

// App wrapper to handle loading -> auth -> main app flow
function AppWrapper({ App, props }) {
  const [showLoading, setShowLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated from server (via Inertia props)
    const serverUser = props?.initialPage?.props?.auth?.user;

    if (serverUser) {
      setUser(serverUser);
      setIsAuthenticated(true);
      setShowLoading(true);
      setShowAuth(false);
      // Store in localStorage for client-side consistency
      localStorage.setItem("user", JSON.stringify(serverUser));
      localStorage.setItem("authenticated", "true");
    } else {
      // Check localStorage as fallback
      const storedAuth = localStorage.getItem("authenticated");
      const storedUser = localStorage.getItem("user");

      if (storedAuth === "true" && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        setShowLoading(true);
        setShowAuth(false);
      }
    }
  }, [props]);

  const handleLoadingComplete = () => {
    setShowLoading(false);

    // If not authenticated, show auth page
    if (!isAuthenticated) {
      setShowAuth(true);
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  // Smooth cinematic transitions between screens
  return (
    <AnimatePresence mode="sync">
      {" "}
      {/* sync mode for overlapping transitions */}
      {showLoading ? (
        <LoadingScreen3D
          key="loading"
          onLoadingComplete={handleLoadingComplete}
        />
      ) : showAuth && !isAuthenticated ? (
        <AuthPage key="auth" onAuthSuccess={handleAuthSuccess} />
      ) : (
        <App key="app" {...props} />
      )}
    </AnimatePresence>
  );
}

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.jsx`,
      import.meta.glob("./Pages/**/*.jsx")
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(<AppWrapper App={App} props={props} />);
  },
  progress: {
    color: "#4B5563",
  },
});
