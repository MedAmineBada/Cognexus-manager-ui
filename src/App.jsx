import FeatureFlagsPage from "./pages/FeatureFlagsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import InitPage from "./pages/InitPage.jsx";
import { useAppRouter } from "./hooks/useAppRouter.js";
import { useIdleLogout } from "./hooks/useIdleLogout.js";

export default function App() {
  const { route, navigate } = useAppRouter();

  // Set idle timeout to 30 seconds for testing (30000ms)
  // Change to 3600000 for 60 minutes in production
  const IDLE_TIMEOUT = 3600000; // 30 seconds for testing

  // Enable idle logout (hook handles authentication check internally)
  useIdleLogout(IDLE_TIMEOUT);

  // Show loading state while checking if user exists
  if (route === "loading") {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner"></div>
        <p className="app-loading__text">Loading...</p>
      </div>
    );
  }

  if (route === "features") {
    return <FeatureFlagsPage />;
  }

  if (route === "register") {
    return <RegisterPage navigate={navigate} />;
  }

  if (route === "init") {
    return <InitPage navigate={navigate} />;
  }

  // Default to login route
  return <LoginPage navigate={navigate} />;
}
