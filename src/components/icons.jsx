const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function Icon({ name, size = 18, className = "" }) {
  switch (name) {
    case "toggle":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <rect x="3" y="8" width="18" height="8" rx="4" />
          <circle cx="9" cy="12" r="3" fill="currentColor" stroke="none" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <path d="M12 3 19 6v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
          <path d="M9 12l2 2 4-5" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M7 15l3-3 3 2 5-7" />
          <path d="M18 7v4h-4" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.4 2.42-.08-.02a1.7 1.7 0 0 0-1.97.58l-.04.06-2.72-1a7.9 7.9 0 0 1-1.24.72l-.4 2.9H10l-.4-2.9a7.9 7.9 0 0 1-1.24-.72l-2.72 1-.04-.06a1.7 1.7 0 0 0-1.97-.58l-.08.02-1.4-2.42.06-.06A1.7 1.7 0 0 0 2.6 15L1.5 14v-4l1.1-1A1.7 1.7 0 0 0 2.6 7l-.06-.06L3.94 4.5l.08.02a1.7 1.7 0 0 0 1.97-.58l.04-.06 2.72 1c.4-.28.82-.53 1.24-.72l.4-2.9h4l.4 2.9c.42.19.84.44 1.24.72l2.72-1 .04.06a1.7 1.7 0 0 0 1.97.58l.08-.02 1.4 2.42-.06.06A1.7 1.7 0 0 0 21.4 10l1.1 1v4l-1.1 1z" />
        </svg>
      );
    case "terminal":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <path d="M4 5h16v14H4z" />
          <path d="M7 10l3 2-3 2" />
          <path d="M12 14h5" />
        </svg>
      );
    case "server":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <rect x="4" y="4" width="16" height="6" rx="1.5" />
          <rect x="4" y="14" width="16" height="6" rx="1.5" />
          <path d="M8 7h.01M8 17h.01" />
          <path d="M12 7h4M12 17h4" />
        </svg>
      );
    case "bell":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <path d="M6 9a6 6 0 1 1 12 0c0 7 3 6 3 8H3c0-2 3-1 3-8" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
      );
    case "help":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.6 2.6 0 0 1 5 1c0 1.8-2.5 1.9-2.5 4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "package":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z" />
          <path d="M12 3v18" />
          <path d="M3.5 7.5 12 12l8.5-4.5" />
        </svg>
      );
    case "payment":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 15h4" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "link":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
          <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16.2 16.2 20 20" />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      );
    case "box":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className} {...stroke}>
          <path d="M7 4h10l4 4v12H3V8l4-4Z" />
          <path d="M3 8h18" />
        </svg>
      );
    case "dot":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}
