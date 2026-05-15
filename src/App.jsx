import FeatureFlagsPage from "./pages/FeatureFlagsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { useAppRouter } from "./hooks/useAppRouter.js";

export default function App() {
  const { route, navigate } = useAppRouter();

  if (route === "features") {
    return <FeatureFlagsPage />;
  }

  // For register and init routes, show login for now (can be expanded later)
  return <LoginPage navigate={navigate} />;
}
