import { useCallback, useEffect, useRef, useState } from "react";
import { isAuthenticated, checkUserExists } from "../api/auth.js";

export const ROUTES = {
  login: "/login",
  register: "/register",
  init: "/init",
  features: "/features",
  security: "/security",
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["login", "register", "init"];

function resolveRoute() {
  const { pathname } = window.location;
  if (pathname === ROUTES.features) return "features";
  if (pathname === ROUTES.security) return "security";
  if (pathname === ROUTES.register) return "register";
  if (pathname === ROUTES.init) return "init";
  if (pathname === ROUTES.login) return "login";
  // Default to login route
  return "login";
}

export function useAppRouter() {
  const [route, setRoute] = useState(resolveRoute);
  const [isChecking, setIsChecking] = useState(true);
  const isInitialMount = useRef(true);

  // Check if user exists on app launch
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    async function performInitialCheck() {
      try {
        const { userExists } = await checkUserExists();

        const currentRoute = resolveRoute();
        const isPublicRoute = PUBLIC_ROUTES.includes(currentRoute);
        const isAuthed = isAuthenticated();

        // If no user exists, force redirect to /init
        if (!userExists) {
          if (window.location.pathname !== ROUTES.init) {
            window.history.replaceState({}, "", ROUTES.init);
          }
          setRoute("init");
          setIsChecking(false);
          return;
        }

        // User exists, continue with normal auth flow
        // If trying to access protected route without auth, redirect to login
        if (!isPublicRoute && !isAuthed) {
          if (window.location.pathname !== ROUTES.login) {
            window.history.replaceState({}, "", ROUTES.login);
          }
          setRoute("login");
          setIsChecking(false);
          return;
        }

        // If authenticated and on login/init page, redirect to features
        if (isAuthed && (currentRoute === "login" || currentRoute === "init")) {
          if (window.location.pathname !== ROUTES.features) {
            window.history.replaceState({}, "", ROUTES.features);
          }
          setRoute("features");
          setIsChecking(false);
          return;
        }

        setRoute(currentRoute);
      } catch (error) {
        console.error("Initial check failed:", error);
        // On error, default to login flow
        setRoute("login");
      } finally {
        setIsChecking(false);
      }
    }

    performInitialCheck();
  }, []);

  const navigate = useCallback((name) => {
    const path = ROUTES[name] || ROUTES.login;
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setRoute(name);
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/" && !isChecking) {
      window.history.replaceState({}, "", ROUTES.login);
      setRoute("login"); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [isChecking]);

  useEffect(() => {
    const onPopState = () => {
      const currentRoute = resolveRoute();
      const isPublicRoute = PUBLIC_ROUTES.includes(currentRoute);
      const isAuthed = isAuthenticated();

      /* eslint-disable react-hooks/set-state-in-effect */
      // Route guard on popstate (browser back/forward)
      if (!isPublicRoute && !isAuthed) {
        window.history.replaceState({}, "", ROUTES.login);
        setRoute("login");
        return;
      }

      if (isAuthed && (currentRoute === "login" || currentRoute === "init")) {
        window.history.replaceState({}, "", ROUTES.features);
        setRoute("features");
        return;
      }

      setRoute(currentRoute);
      /* eslint-enable react-hooks/set-state-in-effect */
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Show loading state while checking
  if (isChecking) {
    return { route: "loading", navigate };
  }

  return { route, navigate };
}
