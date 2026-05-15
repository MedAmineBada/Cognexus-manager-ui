import { useEffect } from "react";
import { Icon } from "../ui/Icons.jsx";

export function ErrorPopup({ message, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="error-popup-overlay"
      role="alert"
      aria-live="assertive"
      onClick={onClose}
    >
      <div className="error-popup" onClick={(e) => e.stopPropagation()}>
        <div className="error-popup__header">
          <div className="error-popup__icon">
            <Icon name="close" className="error-popup__icon-svg" />
          </div>
          <h3 className="error-popup__title">Authentication Error</h3>
          <button
            className="error-popup__close"
            onClick={onClose}
            aria-label="Close error message"
          >
            <Icon name="close" className="error-popup__close-icon" />
          </button>
        </div>
        <p className="error-popup__message">{message}</p>
        <button className="error-popup__action" onClick={onClose}>
          Try Again
        </button>
      </div>
    </div>
  );
}
