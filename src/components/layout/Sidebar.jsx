import { useState, useEffect } from "react";
import { Icon } from "../ui/Icons.jsx";
import { logout } from "../../api/auth.js";

const items = [
  { label: "Controls", icon: "sliders", route: "/features" },
  { label: "Security", icon: "shield", route: "/security" },
  { label: "Insights", icon: "chart", route: null },
];

const footerItems = [{ label: "Logout", icon: "logout" }];

export function Sidebar({
  mobileOpen,
  onClose,
  isMobileNav,
  activeItem = "features",
}) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleNavigate = (route) => {
    if (route && window.location.pathname !== route) {
      window.history.pushState({}, "", route);
      setCurrentPath(route);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
    if (mobileOpen) {
      onClose();
    }
  };

  return (
    <>
      {isMobileNav ? (
        <button
          type="button"
          className={`sidebar-overlay ${mobileOpen ? "is-open" : ""}`}
          aria-label="Close sidebar"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`sidebar ${isMobileNav ? "sidebar--mobile" : ""} ${mobileOpen ? "is-open" : ""}`}
        aria-label="Main Navigation"
        aria-hidden={isMobileNav ? !mobileOpen : undefined}
      >
        <div className="sidebar__brand">
          <img
            src="/cognexus-logo.png"
            alt="Cognexus"
            className="sidebar__logo-img"
          />
          <div>
            <div className="sidebar__title">Cognexus</div>
            <div className="sidebar__subtitle">System Manager</div>
          </div>
        </div>

        <nav className="sidebar__nav" aria-label="Sections">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`sidebar__item ${item.route === currentPath ? "is-active" : ""}`}
              onClick={() => handleNavigate(item.route)}
            >
              <Icon name={item.icon} className="sidebar__icon" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          {footerItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`sidebar__item ${item.label === "Logout" ? "sidebar__item--logout" : ""}`}
              onClick={item.label === "Logout" ? handleLogout : undefined}
            >
              <Icon name={item.icon} className="sidebar__icon" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
