import React from 'react';
export function ToggleSwitch({ checked, onChange, label = 'Toggle flag' }) {
  return (
    <button type="button" className={`toggle ${checked ? 'toggle--on' : 'toggle--off'}`} onClick={() => onChange?.(!checked)} aria-label={label} aria-pressed={checked}>
      <span className="toggle__thumb" />
    </button>
  );
}
