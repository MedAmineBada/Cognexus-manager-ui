import React from 'react';
import { Icon } from '../ui/Icons.jsx';

export function FlagToolbar({ query, onQueryChange }) {
  return (
    <div className="page-toolbar">
      <div>
        <h1 className="page-title">Feature Flags</h1>
        <p className="page-subtitle">Manage global microservice toggles and localized endpoint features.</p>
      </div>
      <div className="page-toolbar__actions">
        <label className="search-field">
          <Icon name="search" className="search-field__icon" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="search-field__input"
            placeholder="Search..."
            type="text"
          />
        </label>
      </div>
    </div>
  );
}
