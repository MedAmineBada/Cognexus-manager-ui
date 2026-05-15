import { useCallback, useEffect, useRef, useState } from "react";
import { isAuthenticated } from "../api/auth.js";

export const ROUTES = {
  login: "/login",
  register: "/register",
  init: "/init",
  features: "/features",
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["login", "register", "init"];

function resolveRoute() {
  const { pathname } = window.location;
  if (pathname === ROUTES.features) return "features";
  if (pathname === ROUTES.register) return "register";
  if (pathname === ROUTES.init) return "init";
  return "login";
}

export function useAppRouter() {
  const [route, setRoute] = useState(resolveRoute);
  const isInitialMount = useRef(true);

  const navigate = useCallback((name) => {
    const path = ROUTES[name] || ROUTES.login;
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setRoute(name);
  }, []);

  // Route guard: Check authentication on mount and route changes
  useEffect(() => {
    if (!isInitialMount.current) return;
    isInitialMount.current = false;

    const currentRoute = resolveRoute();
    const isPublicRoute = PUBLIC_ROUTES.includes(currentRoute);
    const isAuthed = isAuthenticated();

    // If trying to access protected route without auth, redirect to login
    if (!isPublicRoute && !isAuthed) {
      if (window.location.pathname !== ROUTES.login) {
        window.history.replaceState({}, "", ROUTES.login);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRoute("login");
      return;
    }

    // If authenticated and on login page, redirect to features
    if (isAuthed && currentRoute === "login") {
      if (window.location.pathname !== ROUTES.features) {
        window.history.replaceState({}, "", ROUTES.features);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRoute("features");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRoute(currentRoute);
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/") {
      window.history.replaceState({}, "", ROUTES.login);
      setRoute("login"); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, []);

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

      if (isAuthed && currentRoute === "login") {
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

  return { route, navigate };
}
