import { Icon } from "../ui/Icons.jsx";

export function LoginShell({ theme, onToggleTheme, children }) {
  return (
    <div className="login-shell">
      <button
        type="button"
        className="icon-btn login-shell__theme"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        onClick={onToggleTheme}
      >
        <Icon
          name={theme === "dark" ? "sun" : "moon"}
          className="icon-btn__svg"
        />
      </button>

      <main className="login-shell__main">{children}</main>
    </div>
  );
}
