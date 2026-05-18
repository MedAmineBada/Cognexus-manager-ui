import { useState } from "react";
import { Icon } from "../ui/Icons.jsx";
import { validateName, validateEmail } from "../../utils/validation.js";

export function UpdateUserModal({ onClose, onSave, user }) {
  const [formData, setFormData] = useState(() => ({
    name: user?.username || "",
    email: user?.email || "",
    status: user?.status || "active",
  }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate on blur
    let error = null;
    if (field === "name") {
      const validation = validateName(formData.name);
      if (!validation.valid) error = validation.error;
    } else if (field === "email") {
      const validation = validateEmail(formData.email);
      if (!validation.valid) error = validation.error;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    const nameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);

    if (!nameValidation.valid) newErrors.name = nameValidation.error;
    if (!emailValidation.valid) newErrors.email = emailValidation.error;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, email: true });
      return;
    }

    // Check if data has changed
    const hasChanges =
      formData.name !== user.username ||
      formData.email !== user.email ||
      formData.status !== user.status;

    if (!hasChanges) {
      // No changes, just close modal
      onClose();
      return;
    }

    onSave(user.id, formData);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Update User</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon name="close" className="modal-close-icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-field">
            <label className="form-field__label" htmlFor="update-name">
              Name
            </label>
            <input
              id="update-name"
              type="text"
              className={`form-field__input ${touched.name && errors.name ? "form-field__input--error" : ""}`}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="Enter full name"
            />
            {touched.name && errors.name && (
              <span className="form-field__error">{errors.name}</span>
            )}
          </div>

          <div className="form-field">
            <label className="form-field__label" htmlFor="update-email">
              Email
            </label>
            <input
              id="update-email"
              type="email"
              className={`form-field__input ${touched.email && errors.email ? "form-field__input--error" : ""}`}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="Enter email address"
            />
            {touched.email && errors.email && (
              <span className="form-field__error">{errors.email}</span>
            )}
          </div>

          <div className="form-field">
            <label className="form-field__label" htmlFor="update-status">
              Status
            </label>
            <select
              id="update-status"
              className="form-field__select"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary-btn" onClick={handleSubmit}>
            <Icon name="check" className="btn-icon" />
            <span>Update User</span>
          </button>
        </div>
      </div>
    </div>
  );
}
