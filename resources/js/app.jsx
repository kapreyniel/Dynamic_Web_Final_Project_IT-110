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
  const currentPage = props?.initialPage?.component;
  const isLandingPage = currentPage === "Landing";
  const isHomePage = currentPage === "Home";
  const serverUser = props?.initialPage?.props?.auth?.user;
  const forceLoading = props?.initialPage?.props?.forceLoading;

  // Determine initial state based on page and authentication
  const [showLoading, setShowLoading] = useState(() => {
    // Always show loading if forceLoading flag is set (from /explore)
    if (isHomePage && forceLoading) {
      return true;
    }
    // Show loading only when on Home page and not authenticated
    return isHomePage && !serverUser;
  });
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!serverUser);
  const [user, setUser] = useState(serverUser || null);

  useEffect(() => {
    // If forceLoading is set (from /explore), ALWAYS reset and show loading->auth flow
    if (forceLoading) {
      // Clear all auth state
      localStorage.removeItem("user");
      localStorage.removeItem("authenticated");
      setUser(null);
      setIsAuthenticated(false);
      setShowAuth(false);
      setShowLoading(true);

      // Force component re-mount by updating key
      return;
    }

    // Sync with server authentication state
    if (serverUser) {
      setUser(serverUser);
      setIsAuthenticated(true);
      setShowLoading(false);
      setShowAuth(false);
      // Store in localStorage for client-side consistency
      localStorage.setItem("user", JSON.stringify(serverUser));
      localStorage.setItem("authenticated", "true");
    } else if (isHomePage) {
      // Not authenticated on Home page - this should trigger loading flow
      localStorage.removeItem("user");
      localStorage.removeItem("authenticated");
      setIsAuthenticated(false);
      setShowLoading(true);
    }
  }, [serverUser, isHomePage, forceLoading]);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    // Always show auth if not authenticated
    if (!isAuthenticated) {
      setShowAuth(true);
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowAuth(false);
    // window.location.href in AuthPage will handle full page navigation
  };

  // Landing page - no authentication required
  if (isLandingPage) {
    return <App key="app" {...props} />;
  }

  // Authenticated users on /home - go directly to app
  if (isAuthenticated && serverUser) {
    return <App key="app" {...props} />;
  }

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
