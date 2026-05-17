import { useState, useEffect } from "react";
import { Icon } from "../ui/Icons.jsx";
import { clearAuth } from "../../api/auth.js";

export function RotationLogoutModal({ duration = 5000 }) {
  const [timeLeft, setTimeLeft] = useState(Math.ceil(duration / 1000));

  useEffect(() => {
    // Update countdown every second
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-logout and redirect after duration
    const logoutTimer = setTimeout(() => {
      clearAuth();
      window.location.href = "/";
    }, duration);

    return () => {
      clearInterval(countdownTimer);
      clearTimeout(logoutTimer);
    };
  }, [duration]);

  return (
    <div
      className="rotation-logout-modal-overlay"
      role="dialog"
      aria-modal="true"
    >
      <div className="rotation-logout-modal">
        <div className="rotation-logout-modal__progress" />

        <div className="rotation-logout-modal__icon">
          <Icon name="info" className="rotation-logout-modal__icon-svg" />
        </div>

        <h3 className="rotation-logout-modal__title">Security Keys Rotated</h3>

        <p className="rotation-logout-modal__message">
          Your security keys have been rotated successfully. To ensure the
          system continues to operate correctly with the new keys, you will be
          logged out automatically.
        </p>

        <p className="rotation-logout-modal__timer">
          Redirecting to login in <strong>{timeLeft}</strong> second
          {timeLeft !== 1 ? "s" : ""}...
        </p>

        <p className="rotation-logout-modal__subtext">
          Please login again with your credentials.
        </p>
      </div>
    </div>
  );
}
