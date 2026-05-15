import FeatureFlagsPage from "./pages/FeatureFlagsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { useAppRouter } from "./hooks/useAppRouter.js";
import { useIdleLogout } from "./hooks/useIdleLogout.js";

export default function App() {
  const { route, navigate } = useAppRouter();

  // Set idle timeout to 30 seconds for testing (30000ms)
  // Change to 3600000 for 60 minutes in production
  const IDLE_TIMEOUT = 3600000; // 30 seconds for testing

  // Enable idle logout (hook handles authentication check internally)
  useIdleLogout(IDLE_TIMEOUT);

  if (route === "features") {
    return <FeatureFlagsPage />;
  }

  // For register and init routes, show login for now (can be expanded later)
  return <LoginPage navigate={navigate} />;
}
