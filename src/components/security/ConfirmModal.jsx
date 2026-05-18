import { Icon } from "../ui/Icons.jsx";

export function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default", // "default" or "danger"
}) {
  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            className="modal-close"
            onClick={onCancel}
            aria-label="Close modal"
          >
            <Icon name="close" className="modal-close-icon" />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ margin: 0, lineHeight: "1.6", textAlign: "center" }}>
            {message}
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary-btn" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`primary-btn ${variant === "danger" ? "primary-btn--danger" : ""}`}
            onClick={onConfirm}
          >
            <Icon
              name={variant === "danger" ? "trash" : "check"}
              className="btn-icon"
            />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
