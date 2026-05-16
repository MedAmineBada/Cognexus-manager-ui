import { useState } from "react";
import { Icon } from "../ui/Icons.jsx";
import { register } from "../../api/auth.js";
import { validateRegistrationForm } from "../../utils/validation.js";
import { SuccessModal } from "./SuccessModal.jsx";
import { ErrorModal } from "./ErrorModal.jsx";

export function RegisterCard({ onSubmit, onNavigateLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setValidationErrors({});
    setIsLoading(true);

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const invitationCode = formData.get("invitationCode");

    // Client-side validation
    const validation = validateRegistrationForm({
      name,
      email,
      password,
      code: invitationCode,
    });

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      // Show the first error in the error display
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      setIsLoading(false);
      return;
    }

    console.log("Attempting registration with:", { name, email });

    try {
      const result = await register(name, email, password, invitationCode);
      console.log("Register result:", result);

      if (result.success) {
        // Show success modal
        setShowSuccess(true);
      } else {
        // Show error based on status code
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration exception:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessDismiss = () => {
    setShowSuccess(false);
    onSubmit();
  };

  return (
    <section className="register-card" aria-labelledby="register-heading">
      {isLoading && (
        <div
          className="register-spinner-overlay"
          role="status"
          aria-label="Creating account"
        >
          <div className="register-spinner">
            <div className="register-spinner__ring"></div>
            <div className="register-spinner__text">Creating account...</div>
          </div>
        </div>
      )}

      {showSuccess && (
        <SuccessModal
          message="Redirecting to login. Please log in with your credentials."
          onDismiss={handleSuccessDismiss}
          duration={4000}
        />
      )}

      {error && <ErrorModal message={error} onDismiss={() => setError(null)} />}

      <div className="register-card__intro">
        <h2 id="register-heading" className="register-card__title">
          Create Manager Account
        </h2>
        <p className="register-card__subtitle">
          Enter your credentials to register an account
        </p>
      </div>

      <form className="register-card__form" onSubmit={handleSubmit}>
        <div className="field">
          <label
            className="register-card__label field__label"
            htmlFor="register-name"
          >
            Full Name
          </label>
          <input
            id="register-name"
            className={`field__input register-card__input${
              validationErrors.name ? " register-card__input--error" : ""
            }`}
            type="text"
            name="name"
            placeholder="John Doe"
            autoComplete="name"
          />
          {validationErrors.name && (
            <p className="register-card__field-error">
              {validationErrors.name}
            </p>
          )}
        </div>

        <div className="field">
          <label
            className="register-card__label field__label"
            htmlFor="register-email"
          >
            Email
          </label>
          <input
            id="register-email"
            className={`field__input register-card__input${
              validationErrors.email ? " register-card__input--error" : ""
            }`}
            type="email"
            name="email"
            placeholder="name@example.com"
            autoComplete="email"
          />
          {validationErrors.email && (
            <p className="register-card__field-error">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div className="field">
          <label
            className="register-card__label field__label"
            htmlFor="register-password"
          >
            Password
          </label>
          <div className="register-card__password-wrapper">
            <input
              id="register-password"
              className={`field__input register-card__input register-card__password-input${
                validationErrors.password ? " register-card__input--error" : ""
              }`}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="register-card__password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                className="register-card__password-toggle-icon"
              />
            </button>
          </div>
          {validationErrors.password && (
            <p className="register-card__field-error">
              {validationErrors.password}
            </p>
          )}
        </div>

        <div className="field">
          <div className="register-card__invitation-header">
            <label
              className="register-card__label field__label"
              htmlFor="register-invitation"
            >
              Invitation Code
            </label>
            <span className="register-card__required-badge">
              <Icon name="info" className="register-card__required-icon" />
              REQUIRED
            </span>
          </div>
          <input
            id="register-invitation"
            className={`field__input register-card__input register-card__invitation-input${
              validationErrors.code ? " register-card__input--error" : ""
            }`}
            type="text"
            name="invitationCode"
            placeholder="A1B2C3"
            maxLength="6"
            autoComplete="off"
          />
          {validationErrors.code && (
            <p className="register-card__field-error">
              {validationErrors.code}
            </p>
          )}
          <p className="register-card__invitation-help">
            This 6-character alphanumeric code must be provided by an existing
            system administrator.
          </p>
        </div>

        <div className="register-card__activation-notice">
          <Icon name="info" className="register-card__activation-icon" />
          <p className="register-card__activation-text">
            After creating your account, you must await activation by another
            administrator before you can log in. Please contact the
            administrator who provided your invitation code.
          </p>
        </div>

        <button type="submit" className="primary-btn register-card__submit">
          <span>Create Account</span>
          <Icon name="arrow-forward" className="primary-btn__icon" />
        </button>
      </form>

      {onNavigateLogin && (
        <div className="register-card__footer">
          <p className="register-card__footer-text">
            Already have an account?{" "}
            <button
              type="button"
              className="register-card__footer-link"
              onClick={onNavigateLogin}
            >
              Log In
            </button>
          </p>
        </div>
      )}
    </section>
  );
}
