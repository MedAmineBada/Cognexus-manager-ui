import React, { useState } from "react";
import { useTheme } from "../hooks/useTheme.js";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { TopBar } from "../components/layout/TopBar.jsx";
import { Icon } from "../components/ui/Icons.jsx";

// Mock data for JWT secrets
const mockAdminJWT = {
  secret: "super-secret-admin-key-2023-xyz",
  nextRotation: "In 7 Days",
  scheduledTime: "11:59 PM",
  status: "ACTIVE",
};

const mockMainJWT = {
  secret: "main-sys-prod-key-auth-9921",
  nextRotation: "In 7 Days",
  scheduledTime: "11:59 PM",
  status: "ACTIVE",
};

// Mock data for account management
const mockAccounts = [
  {
    id: 1,
    name: "Root User",
    initials: "R",
    role: "SUPERADMIN",
    isRoot: true,
  },
  {
    id: 2,
    name: "Admin One",
    initials: "A1",
    role: "ADMIN",
    isRoot: false,
  },
  {
    id: 3,
    name: "Admin Two",
    initials: "A2",
    role: "ADMIN",
    isRoot: false,
  },
];

function useMediaQuery(query) {
  const getMatches = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatches);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const updateMatch = () => setMatches(mediaQueryList.matches);

    updateMatch();
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", updateMatch);
    } else {
      mediaQueryList.addListener(updateMatch);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", updateMatch);
      } else {
        mediaQueryList.removeListener(updateMatch);
      }
    };
  }, [query]);

  return matches;
}

function JWTCard({ title, icon, jwtData }) {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="security-card">
      <div className="security-card__header">
        <div className="security-card__title-group">
          <Icon name={icon} className="security-card__icon" />
          <h3 className="security-card__title">{title}</h3>
        </div>
        <span className="badge badge--neutral">{jwtData.status}</span>
      </div>

      <div className="security-card__body">
        <div className="security-card__grid">
          <div className="security-field">
            <label className="security-field__label">Current Secret</label>
            <div className="security-field__input-group">
              <input
                className="security-field__input"
                type={showSecret ? "text" : "password"}
                value={jwtData.secret}
                readOnly
              />
              <button
                type="button"
                className="security-field__toggle"
                onClick={() => setShowSecret(!showSecret)}
                aria-label={showSecret ? "Hide secret" : "Show secret"}
              >
                <Icon
                  name={showSecret ? "eye-off" : "eye"}
                  className="security-field__toggle-icon"
                />
              </button>
            </div>
          </div>

          <div className="security-field">
            <label className="security-field__label">Next Auto-Rotation</label>
            <div className="security-field__info">
              <span className="security-field__value">
                {jwtData.nextRotation}
              </span>
              <span className="security-field__subtext">
                Scheduled: {jwtData.scheduledTime}
              </span>
            </div>
          </div>
        </div>

        <div className="security-card__footer">
          <button type="button" className="primary-btn">
            Rotate Now
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountTable({ accounts }) {
  return (
    <div className="security-card security-card--full-height">
      <div className="security-card__header security-card__header--with-actions">
        <h3 className="security-card__title">Account Management</h3>
        <button type="button" className="secondary-btn secondary-btn--sm">
          <Icon name="plus" className="secondary-btn__icon" />
          Add Account
        </button>
      </div>

      <div className="security-card__body security-card__body--scrollable">
        <table className="security-table">
          <thead className="security-table__head">
            <tr>
              <th className="security-table__cell security-table__cell--header">
                User
              </th>
              <th className="security-table__cell security-table__cell--header">
                Role
              </th>
              <th className="security-table__cell security-table__cell--header security-table__cell--right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="security-table__body">
            {accounts.map((account) => (
              <tr key={account.id} className="security-table__row">
                <td className="security-table__cell">
                  <div className="security-table__user">
                    <div
                      className={`security-table__avatar ${account.isRoot ? "security-table__avatar--root" : ""}`}
                    >
                      {account.initials}
                    </div>
                    <span
                      className={`security-table__name ${account.isRoot ? "security-table__name--bold" : ""}`}
                    >
                      {account.name}
                    </span>
                  </div>
                </td>
                <td className="security-table__cell">
                  <span
                    className={`badge ${account.isRoot ? "badge--danger" : "badge--soft"}`}
                  >
                    {account.role}
                  </span>
                </td>
                <td className="security-table__cell security-table__cell--right">
                  <button
                    type="button"
                    className="security-table__action"
                    disabled={account.isRoot}
                    aria-label={`Actions for ${account.name}`}
                  >
                    <Icon
                      name="settings"
                      className="security-table__action-icon"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SecurityPage() {
  const { theme, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobileNav = useMediaQuery("(max-width: 920px)");

  React.useEffect(() => {
    if (!isMobileNav) setMobileNavOpen(false);
  }, [isMobileNav]);

  React.useEffect(() => {
    if (!isMobileNav) return undefined;
    const previousOverflow = document.body.style.overflow;
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileNav, mobileNavOpen]);

  return (
    <div
      className={`app-shell app-shell--controls ${mobileNavOpen ? "app-shell--nav-open" : ""}`}
    >
      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        isMobileNav={isMobileNav}
      />
      <div className="app-shell__main">
        <TopBar
          theme={theme}
          onToggleTheme={toggleTheme}
          isMobileNav={isMobileNav}
          onToggleMobileNav={() => setMobileNavOpen((current) => !current)}
          breadcrumb="Security"
        />

        <main className="page page--security">
          <div className="page-toolbar">
            <div>
              <h1 className="page-title">Security Management</h1>
              <p className="page-subtitle">
                Manage authentication tokens and system access controls.
              </p>
            </div>
          </div>

          <div className="security-grid">
            <div className="security-grid__left">
              <JWTCard
                title="Admin System JWT"
                icon="key"
                jwtData={mockAdminJWT}
              />
              <JWTCard
                title="Main System JWT"
                icon="security"
                jwtData={mockMainJWT}
              />
            </div>

            <div className="security-grid__right">
              <AccountTable accounts={mockAccounts} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
