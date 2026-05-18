import { useState } from "react";
import { Icon } from "../ui/Icons.jsx";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../../utils/validation.js";

export function AddAdminModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    status: "active",
  });
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
    } else if (field === "password") {
      const validation = validatePassword(formData.password);
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
    const usernameValidation = validateName(formData.name);
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);

    if (!usernameValidation.valid) newErrors.name = usernameValidation.error;
    if (!emailValidation.valid) newErrors.email = emailValidation.error;
    if (!passwordValidation.valid)
      newErrors.password = passwordValidation.error;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, email: true, password: true });
      return;
    }

    onSave(formData);
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
          <h2 className="modal-title">Add New Admin</h2>
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
            <label className="form-field__label" htmlFor="admin-name">
              Name
            </label>
            <input
              id="admin-name"
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
            <label className="form-field__label" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
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
            <label className="form-field__label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className={`form-field__input ${touched.password && errors.password ? "form-field__input--error" : ""}`}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              placeholder="Enter password"
            />
            {touched.password && errors.password && (
              <span className="form-field__error">{errors.password}</span>
            )}
          </div>

          <div className="form-field">
            <label className="form-field__label" htmlFor="admin-status">
              Status
            </label>
            <select
              id="admin-status"
              className="form-field__select"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="primary-btn" onClick={handleSubmit}>
            <Icon name="check" className="btn-icon" />
            <span>Create Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
