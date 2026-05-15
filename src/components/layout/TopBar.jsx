import React from 'react';
import { Icon } from '../ui/Icons.jsx';

export function TopBar({ breadcrumb = 'Controls', theme = 'light', onToggleTheme, isMobileNav, onToggleMobileNav }) {
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
        <button type="button" className="icon-btn icon-btn--theme" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={onToggleTheme}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="icon-btn__svg" />
        </button>
      </div>
    </header>
  );
}
