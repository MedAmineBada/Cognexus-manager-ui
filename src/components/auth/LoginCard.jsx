import { useState } from "react";
import { Icon } from "../ui/Icons.jsx";
import { login } from "../../api/auth.js";

export function LoginCard({ onSubmit, onError }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    // Client-side validation
    if (!email || !email.trim()) {
      onError("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    if (!password || !password.trim()) {
      onError("Please enter your password.");
      setIsLoading(false);
      return;
    }

    console.log("Attempting login with:", { email });

    try {
      const result = await login(email, password);
      console.log("Login result:", result);

      if (result.success) {
        // Clear error and navigate to features
        console.log("Login successful, navigating to features");
        onSubmit(event);
      } else {
        // Show error popup via parent
        console.log("Login failed, showing error:", result.error);
        onError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login exception:", err);
      onError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login-card" aria-labelledby="login-heading">
      {isLoading && (
        <div
          className="login-spinner-overlay"
          role="status"
          aria-label="Authenticating"
        >
          <div className="login-spinner">
            <div className="login-spinner__ring"></div>
            <div className="login-spinner__text">Authenticating...</div>
          </div>
        </div>
      )}

      <div className="login-card__intro">
        <h2 id="login-heading" className="login-card__title">
          Sign In
        </h2>
        <p className="login-card__subtitle">
          Enter your credentials to access the dashboard
        </p>
      </div>

      <form className="login-card__form" onSubmit={handleSubmit}>
        <div className="field">
          <label
            className="login-card__label field__label"
            htmlFor="login-email"
          >
            Email
          </label>
          <input
            id="login-email"
            className="field__input login-card__input"
            type="email"
            name="email"
            placeholder="name@example.com"
            autoComplete="email"
          />
        </div>

        <div className="field">
          <label
            className="login-card__label field__label"
            htmlFor="login-password"
          >
            Password
          </label>
          <div className="login-card__password-wrapper">
            <input
              id="login-password"
              className="field__input login-card__input login-card__password-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-card__password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                className="login-card__password-toggle-icon"
              />
            </button>
          </div>
        </div>

        <button type="submit" className="primary-btn login-card__submit">
          <span>Sign In</span>
          <Icon name="arrow-forward" className="primary-btn__icon" />
        </button>
      </form>
    </section>
  );
}
