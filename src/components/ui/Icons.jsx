import React from 'react';

export function Icon({ name, className = '' }) {
  const common = { className, 'aria-hidden': true, focusable: false };

  switch (name) {
    case 'menu':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'toggle':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M7 12a5 5 0 1 1 0 .01Z" fill="currentColor" />
          <rect x="7" y="10.5" width="10" height="3" rx="1.5" fill="currentColor" opacity=".35" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 3 5 6v5c0 5.25 3.5 8.76 7 10 3.5-1.24 7-4.75 7-10V6l-7-3Z" fill="currentColor" />
        </svg>
      );
    case 'chart':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M7 16V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 16V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M17 16v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5a3.5 3.5 0 0 0 0-7Z" fill="currentColor" />
          <path d="M19 12c0-.5-.06-.99-.16-1.46l2-1.54-2-3.46-2.48 1a7.76 7.76 0 0 0-2.54-1.46L13.5 3h-4l-.32 2.08A7.76 7.76 0 0 0 6.64 6.54l-2.48-1-2 3.46 2 1.54A8.4 8.4 0 0 0 4 12c0 .5.06.99.16 1.46l-2 1.54 2 3.46 2.48-1a7.76 7.76 0 0 0 2.54 1.46L9.5 21h4l.32-2.08a7.76 7.76 0 0 0 2.54-1.46l2.48 1 2-3.46-2-1.54c.1-.47.16-.96.16-1.46Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
    case 'terminal':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="m8 10 3 2-3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 14h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'search':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'plus':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'dns':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="4" y="4" width="16" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <rect x="4" y="14" width="16" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 7h.01M8 17h.01" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M11 7h7M11 17h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'notifications':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 4a5 5 0 0 0-5 5v3.4c0 .8-.2 1.5-.7 2.1L5 16h14l-1.3-1.5c-.5-.6-.7-1.3-.7-2.1V9a5 5 0 0 0-5-5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9.5 18a2.5 2.5 0 0 0 5 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'help':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 18h.01M9.5 9a2.5 2.5 0 1 1 3.8 2.1c-.9.5-1.3 1-1.3 2.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case 'chevron-down':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'chevron-right':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'link':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M10 14a4 4 0 0 1 0-6l1.2-1.2a4 4 0 0 1 5.7 5.7L15 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 10a4 4 0 0 1 0 6L12.8 17.2a4 4 0 0 1-5.7-5.7L9 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'close':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'moon':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M15.2 3.9A8.8 8.8 0 1 0 20.1 16a7 7 0 0 1-4.9-12.1Z" fill="currentColor" />
        </svg>
      );
    case 'sun':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
          <path d="M12 2.8v2.4M12 18.8v2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.8 19.2l1.7-1.7M17.5 6.5l1.7-1.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
