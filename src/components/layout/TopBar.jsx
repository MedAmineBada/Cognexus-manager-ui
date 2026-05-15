import React from 'react';
import { Icon } from '../ui/Icons.jsx';

export function TopBar({ breadcrumb = 'Features', theme = 'light', onToggleTheme, isMobileNav, onToggleMobileNav }) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        {isMobileNav ? (
          <button type="button" className="icon-btn icon-btn--menu" aria-label="Open navigation" onClick={onToggleMobileNav}>
            <Icon name="menu" className="icon-btn__svg" />
          </button>
        ) : null}

        <div className="topbar__crumbs" aria-label="Breadcrumb">
          <span className="topbar__crumb">System Manager</span>
          <span className="topbar__slash">/</span>
          <span className="topbar__crumb topbar__crumb--active">{breadcrumb}</span>
        </div>
      </div>

      <div className="topbar__actions">
        <div className="env-badge">
          <span className="env-badge__dot" />
          <span className="env-badge__text">PROD-US-EAST-1</span>
        </div>

        <div className="icon-row">
          <button type="button" className="icon-btn" aria-label="Data sources">
            <Icon name="dns" className="icon-btn__svg" />
          </button>
          <button type="button" className="icon-btn icon-btn--notification" aria-label="Notifications">
            <Icon name="notifications" className="icon-btn__svg" />
            <span className="notification-dot" />
          </button>
          <button type="button" className="icon-btn" aria-label="Help">
            <Icon name="help" className="icon-btn__svg" />
          </button>
          <button type="button" className="icon-btn icon-btn--theme" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={onToggleTheme}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="icon-btn__svg" />
          </button>
        </div>

        <div className="avatar" aria-label="User profile">A</div>
      </div>
    </header>
  );
}
