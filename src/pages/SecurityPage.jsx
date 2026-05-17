import React, { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme.js";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { TopBar } from "../components/layout/TopBar.jsx";
import { Icon } from "../components/ui/Icons.jsx";
import { getSecrets, rotateSecrets } from "../api/secretsApi.js";
import { RotationLogoutModal } from "../components/auth/RotationLogoutModal.jsx";

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

function SecretsCard({ secrets, onRotate, rotating }) {
  const [showJwtSecret, setShowJwtSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    const date = new Date(dateTimeStr);
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatInvitationCode = (code) => {
    if (!code) return "";
    return code.split("").join(" ");
  };

  const handleCopyCode = async () => {
    if (!secrets?.admin_code) return;
    try {
      await navigator.clipboard.writeText(secrets.admin_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="security-card">
      <div className="security-card__header">
        <div className="security-card__title-group">
          <Icon name="key" className="security-card__icon" />
          <h3 className="security-card__title">Secrets</h3>
        </div>
      </div>

      <div className="security-card__body">
        <div className="security-card__grid">
          <div className="security-field">
            <label className="security-field__label">JWT Secret</label>
            <div className="security-field__input-group">
              <input
                className="security-field__input"
                type={showJwtSecret ? "text" : "password"}
                value={secrets?.jwt_secret || ""}
                readOnly
              />
              <button
                type="button"
                className="security-field__toggle"
                onClick={() => setShowJwtSecret(!showJwtSecret)}
                aria-label={showJwtSecret ? "Hide secret" : "Show secret"}
              >
                <Icon
                  name={showJwtSecret ? "eye-off" : "eye"}
                  className="security-field__toggle-icon"
                />
              </button>
            </div>
          </div>

          <div className="security-field">
            <label className="security-field__label">Invitation Code</label>
            <div className="invitation-code-display">
              <code className="invitation-code-text">
                {formatInvitationCode(secrets?.admin_code)}
              </code>
              <button
                type="button"
                className="invitation-code-copy-btn"
                onClick={handleCopyCode}
                aria-label="Copy invitation code"
                title={copied ? "Copied!" : "Copy to clipboard"}
              >
                <Icon
                  name={copied ? "check-circle" : "document"}
                  className="invitation-code-copy-icon"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="security-card__grid" style={{ marginTop: "20px" }}>
          <div className="security-field">
            <label className="security-field__label">Issued At</label>
            <div className="security-field__info">
              <span className="security-field__value">
                {formatDateTime(secrets?.iat)}
              </span>
            </div>
          </div>

          <div className="security-field">
            <label className="security-field__label">Expires At</label>
            <div className="security-field__info">
              <span className="security-field__value">
                {formatDateTime(secrets?.exp)}
              </span>
            </div>
          </div>
        </div>

        <div className="security-card__footer">
          <button
            type="button"
            className="primary-btn"
            onClick={onRotate}
            disabled={rotating}
          >
            {rotating ? "Rotating..." : "Rotate Now"}
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
  const [secrets, setSecrets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [error, setError] = useState(null);
  const [showRotationModal, setShowRotationModal] = useState(false);

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

  // Fetch secrets on page load
  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSecrets();
        setSecrets(data);
      } catch (err) {
        console.error("Failed to fetch secrets:", err);
        setError(err.message || "Failed to load secrets");
      } finally {
        setLoading(false);
      }
    };

    fetchSecrets();
  }, []);

  // Handle secret rotation
  const handleRotate = async () => {
    try {
      setRotating(true);
      setError(null);
      const data = await rotateSecrets();
      setSecrets(data);
      // Show rotation logout modal
      setShowRotationModal(true);
    } catch (err) {
      console.error("Failed to rotate secrets:", err);
      setError(err.message || "Failed to rotate secrets");
    } finally {
      setRotating(false);
    }
  };

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

          {error && (
            <div
              className="error-banner"
              style={{
                padding: "12px 16px",
                backgroundColor: "var(--danger-soft)",
                border: "1px solid var(--danger)",
                borderRadius: "var(--radius)",
                marginBottom: "16px",
                color: "var(--danger)",
              }}
            >
              {error}
            </div>
          )}

          {showRotationModal && <RotationLogoutModal duration={5000} />}

          <div className="security-grid">
            <div className="security-grid__left">
              {loading ? (
                <div className="security-card">
                  <div className="security-card__body">
                    <p>Loading secrets...</p>
                  </div>
                </div>
              ) : (
                <SecretsCard
                  secrets={secrets}
                  onRotate={handleRotate}
                  rotating={rotating}
                />
              )}
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
