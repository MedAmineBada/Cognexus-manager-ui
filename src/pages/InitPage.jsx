import { useTheme } from "../hooks/useTheme.js";
import { LoginBrand } from "../components/auth/LoginBrand.jsx";
import { LoginShell } from "../components/auth/LoginShell.jsx";
import { InitCard } from "../components/auth/InitCard.jsx";

export default function InitPage({ navigate }) {
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = () => {
    // After successful initialization, navigate to login
    navigate("login");
  };

  return (
    <LoginShell theme={theme} onToggleTheme={toggleTheme}>
      <div className="login-canvas">
        <LoginBrand />
        <InitCard onSubmit={handleSubmit} />
      </div>
    </LoginShell>
  );
}
