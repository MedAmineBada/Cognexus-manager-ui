import { useState } from "react";
import { Icon } from "../ui/Icons.jsx";
import { initFirstUser } from "../../api/auth.js";
import { validateInitForm } from "../../utils/validation.js";
import { ErrorModal } from "./ErrorModal.jsx";
import { SuccessModal } from "./SuccessModal.jsx";

export function InitCard({ onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setValidationErrors({});
    setIsLoading(true);

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    // Client-side validation
    const validation = validateInitForm({ name, email, password });

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      // Show the first error in the error display
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      setIsLoading(false);
      return;
    }

    console.log("Attempting initialization with:", { name, email });

    try {
      const result = await initFirstUser(name, email, password);
      console.log("Init result:", result);

      if (result.success) {
        // Show success modal
        setShowSuccess(true);
      } else {
        // Show error based on status code
        setError(result.error || "Initialization failed. Please try again.");
      }
    } catch (err) {
      console.error("Initialization exception:", err);
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
    <section className="init-card" aria-labelledby="init-heading">
      {isLoading && (
        <div
          className="init-spinner-overlay"
          role="status"
          aria-label="Initializing system"
        >
          <div className="init-spinner">
            <div className="init-spinner__ring"></div>
            <div className="init-spinner__text">Initializing system...</div>
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

      <div className="init-card__header">
        <div className="init-card__badge">
          <span className="init-card__badge-text">System Initialization</span>
        </div>
        <h2 id="init-heading" className="init-card__title">
          Initialize System Admin
        </h2>
        <p className="init-card__subtitle">
          This is the first admin account. It will be automatically activated
          and can accept the requests of next admin sign ups.
        </p>
      </div>

      <form className="init-card__form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="init-card__label field__label" htmlFor="init-name">
            Full Name
          </label>
          <input
            id="init-name"
            className={`field__input init-card__input${
              validationErrors.name ? " init-card__input--error" : ""
            }`}
            type="text"
            name="name"
            placeholder="John Doe"
            autoComplete="name"
          />
          {validationErrors.name && (
            <p className="init-card__field-error">{validationErrors.name}</p>
          )}
        </div>

        <div className="field">
          <label className="init-card__label field__label" htmlFor="init-email">
            Email
          </label>
          <input
            id="init-email"
            className={`field__input init-card__input${
              validationErrors.email ? " init-card__input--error" : ""
            }`}
            type="email"
            name="email"
            placeholder="name@example.com"
            autoComplete="email"
          />
          {validationErrors.email && (
            <p className="init-card__field-error">{validationErrors.email}</p>
          )}
        </div>

        <div className="field">
          <label
            className="init-card__label field__label"
            htmlFor="init-password"
          >
            Password
          </label>
          <div className="init-card__password-wrapper">
            <input
              id="init-password"
              className={`field__input init-card__input init-card__password-input${
                validationErrors.password ? " init-card__input--error" : ""
              }`}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="init-card__password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                className="init-card__password-toggle-icon"
              />
            </button>
          </div>
          {validationErrors.password && (
            <p className="init-card__field-error">
              {validationErrors.password}
            </p>
          )}
        </div>

        <button type="submit" className="primary-btn init-card__submit">
          <span>Initialize System</span>
          <Icon name="arrow-forward" className="primary-btn__icon" />
        </button>
      </form>
    </section>
  );
}
