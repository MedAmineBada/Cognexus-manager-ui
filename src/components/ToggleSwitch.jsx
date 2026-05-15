export default function ToggleSwitch({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      className={`switch ${checked ? "is-on" : ""}`}
      aria-pressed={checked}
      aria-label={ariaLabel}
      onClick={onChange}
    >
      <span className="switch__thumb" />
    </button>
  );
}
