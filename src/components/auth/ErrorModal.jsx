import { Icon } from "../ui/Icons.jsx";

export function ErrorModal({ message, title = "Error", onDismiss }) {
  return (
    <div className="error-modal-overlay" role="dialog" aria-modal="true">
      <div className="error-modal">
        <div className="error-modal__icon">
          <Icon name="close" className="error-modal__icon-svg" />
        </div>

        <h3 className="error-modal__title">{title}</h3>

        <p className="error-modal__message" style={{ textAlign: "center" }}>
          {message}
        </p>

        <button
          type="button"
          className="primary-btn error-modal__action"
          onClick={onDismiss}
        >
          <span>OK</span>
        </button>
      </div>
    </div>
  );
}
