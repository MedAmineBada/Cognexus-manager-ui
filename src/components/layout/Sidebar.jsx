import { Icon } from "../ui/Icons.jsx";
import { logout } from "../../api/auth.js";

const items = [
  { label: "Controls", icon: "sliders", active: true },
  { label: "Security", icon: "shield" },
  { label: "Insights", icon: "chart" },
];

const footerItems = [{ label: "Logout", icon: "logout" }];

export function Sidebar({ mobileOpen, onClose, isMobileNav }) {
  const handleLogout = () => {
    logout();
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
              className={`sidebar__item ${item.active ? "is-active" : ""}`}
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
