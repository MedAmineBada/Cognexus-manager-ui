import { Icon } from "./icons";

export default function TopBar() {
  return (
    <header className="topbar" aria-label="Top application bar">
      <div className="topbar__crumbs">
        <span className="topbar__crumb">System Manager</span>
        <span className="topbar__slash">/</span>
        <span className="topbar__crumb topbar__crumb--active">Features</span>
      </div>

      <div className="topbar__actions">
        <div className="env-badge">
          <span className="env-badge__dot" />
          <span>PROD-US-EAST-1</span>
        </div>

        <button className="topbar__icon-btn" type="button" aria-label="Servers">
          <span className="topbar__icon">
            <Icon name="server" />
          </span>
        </button>

        <button className="topbar__icon-btn" type="button" aria-label="Notifications">
          <span className="topbar__icon">
            <Icon name="bell" />
          </span>
          <span className="topbar__dot" />
        </button>

        <button className="topbar__icon-btn" type="button" aria-label="Help">
          <span className="topbar__icon">
            <Icon name="help" />
          </span>
        </button>

        <div className="avatar" aria-label="User profile avatar" />
      </div>
    </header>
  );
}
