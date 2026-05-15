import { Icon } from "./icons";

const items = [
  { id: "Features", label: "Features", icon: "toggle", active: true },
  { id: "Security", label: "Security", icon: "shield" },
  { id: "Insights", label: "Insights", icon: "chart" },
];

const bottomItems = [
  { id: "Settings", label: "Settings", icon: "settings" },
  { id: "Terminal", label: "Terminal", icon: "terminal" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      <div className="sidebar__brand">
        <div className="sidebar__logo">SM</div>
        <div>
          <div className="sidebar__title">System Manager</div>
          <div className="sidebar__subtitle">v2.4.0-stable</div>
        </div>
      </div>

      <nav className="sidebar__group" aria-label="Main">
        {items.map((item) => (
          <a
            key={item.id}
            href="#"
            className={`sidebar__item ${item.active ? "is-active" : ""}`}
          >
            <span className="sidebar__icon">
              <Icon name={item.icon} />
            </span>
            <span className="sidebar__label">{item.label}</span>
          </a>
        ))}
      </nav>

      <nav className="sidebar__group sidebar__group--bottom" aria-label="Utilities">
        {bottomItems.map((item) => (
          <a key={item.id} href="#" className="sidebar__item">
            <span className="sidebar__icon">
              <Icon name={item.icon} />
            </span>
            <span className="sidebar__label">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
