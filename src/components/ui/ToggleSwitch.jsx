import React from 'react';
export function ToggleSwitch({ checked, onChange, label = 'Toggle flag', disabled = false }) {
  return (
    <button
      type="button"
      className={`toggle ${checked ? 'toggle--on' : 'toggle--off'}`}
      onClick={() => !disabled && onChange?.(!checked)}
      aria-label={label}
      aria-pressed={checked}
      disabled={disabled}
    >
      <span className="toggle__thumb" />
    </button>
  );
}
