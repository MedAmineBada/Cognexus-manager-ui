import { useEffect } from "react";
import { Icon } from "../ui/Icons.jsx";

export function SuccessModal({ message, onDismiss, duration = 4000 }) {
  useEffect(() => {
    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onDismiss]);

  const handleDismiss = () => {
    onDismiss();
  };

  return (
    <div className="success-modal-overlay" role="dialog" aria-modal="true">
      <div className="success-modal">
        <div className="success-modal__progress" />

        <div className="success-modal__icon">
          <Icon name="check-circle" className="success-modal__icon-svg" />
        </div>

        <h3 className="success-modal__title">Registration Successful</h3>

        <p className="success-modal__message">{message}</p>

        <button
          type="button"
          className="primary-btn success-modal__action"
          onClick={handleDismiss}
        >
          <span>OK</span>
        </button>
      </div>
    </div>
  );
}
