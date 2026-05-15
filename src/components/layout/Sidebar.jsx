import React from 'react';
import { Icon } from '../ui/Icons.jsx';

const items = [
  { label: 'Features', icon: 'toggle', active: true },
  { label: 'Security', icon: 'shield' },
  { label: 'Insights', icon: 'chart' },
];

const footerItems = [
  { label: 'Settings', icon: 'settings' },
  { label: 'Terminal', icon: 'terminal' },
];

export function Sidebar({ mobileOpen, onClose, isMobileNav }) {
  return (
    <>
      {isMobileNav ? <button type="button" className={`sidebar-overlay ${mobileOpen ? 'is-open' : ''}`} aria-label="Close sidebar" onClick={onClose} /> : null}

      <aside className={`sidebar ${isMobileNav ? 'sidebar--mobile' : ''} ${mobileOpen ? 'is-open' : ''}`} aria-label="Main Navigation" aria-hidden={isMobileNav ? !mobileOpen : undefined}>
        <div className="sidebar__brand">
          <div className="sidebar__logo">SM</div>
          <div>
            <div className="sidebar__title">System Manager</div>
            <div className="sidebar__subtitle">Control Center</div>
          </div>
        </div>

        <nav className="sidebar__nav" aria-label="Sections">
          {items.map((item) => (
            <button key={item.label} type="button" className={`sidebar__item ${item.active ? 'is-active' : ''}`}>
              <Icon name={item.icon} className="sidebar__icon" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          {footerItems.map((item) => (
            <button key={item.label} type="button" className="sidebar__item">
              <Icon name={item.icon} className="sidebar__icon" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
