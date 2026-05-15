import { useEffect, useRef } from "react";
import { logout, isAuthenticated } from "../api/auth.js";

/**
 * Hook to detect user inactivity and automatically log out
 * @param {number} idleTimeoutMs - Time in milliseconds before logout (default: 30000 for testing, 3600000 for 60 mins)
 */
export function useIdleLogout(idleTimeoutMs = 3600000) {
  const timerRef = useRef(null);

  const resetTimer = () => {
    // Only track idle time if user is authenticated
    if (!isAuthenticated()) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      console.log("User idle for too long, logging out...");
      logout();
    }, idleTimeoutMs);
  };

  useEffect(() => {
    // Event types to track user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "wheel",
    ];

    // Reset timer on any user activity
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initialize the timer
    resetTimer();

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [idleTimeoutMs]);
}
