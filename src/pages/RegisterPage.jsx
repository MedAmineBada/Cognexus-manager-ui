import { RegisterCard } from "../components/auth/RegisterCard.jsx";
import { LoginBrand } from "../components/auth/LoginBrand.jsx";
import { LoginShell } from "../components/auth/LoginShell.jsx";
import { useTheme } from "../hooks/useTheme.js";

export default function RegisterPage({ navigate }) {
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = () => {
    // After successful registration, navigate to login
    navigate("login");
  };

  return (
    <LoginShell theme={theme} onToggleTheme={toggleTheme}>
      <div className="login-canvas">
        <LoginBrand />
        <RegisterCard
          onSubmit={handleSubmit}
          onNavigateLogin={() => navigate("login")}
        />
      </div>
    </LoginShell>
  );
}
