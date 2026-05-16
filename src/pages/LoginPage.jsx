import { useState } from "react";
import { LoginBrand } from "../components/auth/LoginBrand.jsx";
import { LoginCard } from "../components/auth/LoginCard.jsx";
import { LoginShell } from "../components/auth/LoginShell.jsx";
import { ErrorPopup } from "../components/auth/ErrorPopup.jsx";
import { useTheme } from "../hooks/useTheme.js";

export default function LoginPage({ navigate }) {
  const { theme, toggleTheme } = useTheme();
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("features");
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <LoginShell theme={theme} onToggleTheme={toggleTheme}>
      {error && <ErrorPopup message={error} onClose={handleCloseError} />}
      <div className="login-canvas">
        <LoginBrand />
        <LoginCard
          onSubmit={handleSubmit}
          onError={setError}
          onNavigateSignUp={() => navigate("register")}
        />
      </div>
    </LoginShell>
  );
}
