import React, { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme.js";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { TopBar } from "../components/layout/TopBar.jsx";
import { Icon } from "../components/ui/Icons.jsx";
import { getSecrets, rotateSecrets } from "../api/secretsApi.js";
import {
  getAccounts,
  getAccountById,
  addUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
} from "../api/accountsApi.js";
import { RotationLogoutModal } from "../components/auth/RotationLogoutModal.jsx";
import { SuccessModal } from "../components/auth/SuccessModal.jsx";
import { ErrorModal } from "../components/auth/ErrorModal.jsx";
import { AddAdminModal } from "../components/security/AddAdminModal.jsx";
import { UpdateUserModal } from "../components/security/UpdateUserModal.jsx";
import { ConfirmModal } from "../components/security/ConfirmModal.jsx";
import { UserProfileModal } from "../components/security/UserProfileModal.jsx";
import { ActionsMenu } from "../components/security/ActionsMenu.jsx";

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

function PendingTable({
  accounts,
  searchQuery,
  onSearchChange,
  onUserClick,
  onAcceptClick,
  onDeleteClick,
}) {
  const filteredAccounts = accounts.filter((account) => {
    const name = account.username || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    const nameA = a.username || "";
    const nameB = b.username || "";
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="security-card security-card--full-height">
      <div className="security-card__header security-card__header--with-actions">
        <h3 className="security-card__title">Pending</h3>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="security-table__search-input"
        />
      </div>

      <div className="security-card__body security-card__body--scrollable">
        <table className="security-table">
          <thead className="security-table__head">
            <tr>
              <th className="security-table__cell security-table__cell--header">
                Name
              </th>
              <th className="security-table__cell security-table__cell--header security-table__cell--right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="security-table__body">
            {sortedAccounts.map((account) => (
              <tr
                key={account.id}
                className="security-table__row"
                onClick={() => onUserClick(account.id)}
                style={{ cursor: "pointer" }}
              >
                <td className="security-table__cell">
                  <div className="security-table__user">
                    <span className="security-table__name">
                      {account.username}
                    </span>
                  </div>
                </td>
                <td className="security-table__cell security-table__cell--right">
                  <div className="security-table__actions">
                    <button
                      type="button"
                      className="secondary-btn secondary-btn--sm security-table__btn-accept"
                      aria-label={`Accept ${account.username}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAcceptClick(account);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="secondary-btn secondary-btn--sm security-table__btn-delete"
                      aria-label={`Delete ${account.username}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(account);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminsTable({
  accounts,
  adminId,
  searchQuery,
  onSearchChange,
  sortField,
  sortOrder,
  onSort,
  onUserClick,
  onActionsClick,
  onAddClick,
}) {
  const filteredAccounts = accounts.filter((account) => {
    const name = account.username || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    const nameA = a.username || "";
    const nameB = b.username || "";

    if (sortField === "name") {
      // Sort alphabetically by name
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortField === "status") {
      // Sort by status: active first, then inactive
      const statusOrder = { active: 0, inactive: 1 };
      const aStatus = statusOrder[a.status] ?? 2;
      const bStatus = statusOrder[b.status] ?? 2;

      if (sortOrder === "asc") {
        // Active first, then alphabetically within each group
        if (aStatus !== bStatus) {
          return aStatus - bStatus;
        }
        return nameA.localeCompare(nameB);
      } else {
        // Inactive first, then alphabetically within each group
        if (aStatus !== bStatus) {
          return bStatus - aStatus;
        }
        return nameA.localeCompare(nameB);
      }
    }

    // Default sort: active first, then alphabetically
    const statusOrder = { active: 0, inactive: 1 };
    const aStatus = statusOrder[a.status] ?? 2;
    const bStatus = statusOrder[b.status] ?? 2;

    if (aStatus !== bStatus) {
      return aStatus - bStatus;
    }
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="security-card security-card--full-height">
      <div className="security-card__header security-card__header--with-actions">
        <h3 className="security-card__title">Admins</h3>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="security-table__search-input"
          />
          <button
            type="button"
            className="secondary-btn secondary-btn--sm security-table__add-btn"
            aria-label="Add Admin"
            onClick={onAddClick}
          >
            <Icon name="plus" className="secondary-btn__icon" />
          </button>
        </div>
      </div>

      <div className="security-card__body security-card__body--scrollable">
        <table className="security-table">
          <thead className="security-table__head">
            <tr>
              <th
                className="security-table__cell security-table__cell--header"
                onClick={() => onSort("name")}
                style={{ cursor: "pointer" }}
              >
                Name
                {sortField === "name" && (
                  <span style={{ marginLeft: "4px", fontSize: "12px" }}>
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className="security-table__cell security-table__cell--header"
                onClick={() => onSort("status")}
                style={{ cursor: "pointer" }}
              >
                Status
                {sortField === "status" && (
                  <span style={{ marginLeft: "4px", fontSize: "12px" }}>
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="security-table__cell security-table__cell--header security-table__cell--right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="security-table__body">
            {sortedAccounts.map((account) => (
              <tr
                key={account.id}
                className="security-table__row"
                onClick={() => onUserClick(account.id)}
                style={{ cursor: "pointer" }}
              >
                <td className="security-table__cell">
                  <div className="security-table__user">
                    <span className="security-table__name">
                      {account.username}
                    </span>
                    {account.id === adminId && (
                      <span className="security-table__you-badge">You</span>
                    )}
                  </div>
                </td>
                <td className="security-table__cell">
                  <span
                    className="badge badge--soft"
                    style={
                      account.status === "inactive"
                        ? {
                            backgroundColor: "var(--danger-soft)",
                            color: "var(--danger)",
                          }
                        : {}
                    }
                  >
                    {account.status}
                  </span>
                </td>
                <td className="security-table__cell security-table__cell--right">
                  <button
                    type="button"
                    className="security-table__action"
                    aria-label={`Actions for ${account.username}`}
                    onClick={(e) => onActionsClick(account, e)}
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

  // Account management state
  const [accounts, setAccounts] = useState([]);
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [adminsSearchQuery, setAdminsSearchQuery] = useState("");
  const [pendingSearchQuery, setPendingSearchQuery] = useState("");
  const [sortField, setSortField] = useState("status");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal states
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [selectedUserForUpdate, setSelectedUserForUpdate] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [actionsMenu, setActionsMenu] = useState(null);
  const [showSelfDeactivateModal, setShowSelfDeactivateModal] = useState(false);

  // Success/Error modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successTitle, setSuccessTitle] = useState("Success");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState(null);

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

  // Fetch accounts on page load
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setAccountsLoading(true);
        const data = await getAccounts();
        setAdminId(data.admin_id);

        // Use data directly from GET /accounts (includes username, email, status)
        const allUsers = data.users || [];

        const activeAndInactive = allUsers.filter(
          (user) => user.status !== "pending",
        );
        const pending = allUsers.filter((user) => user.status === "pending");

        setAccounts(activeAndInactive);
        setPendingAccounts(pending);
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
        setError(err.message || "Failed to load accounts");
      } finally {
        setAccountsLoading(false);
      }
    };

    fetchAccounts();
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

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Handle user row click - show profile
  const handleUserClick = async (userId) => {
    try {
      const data = await getAccountById(userId);
      setSelectedUser(data.user);
      setShowProfileModal(true);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    }
  };

  // Handle add admin button click
  const handleAddAdminClick = () => {
    setShowAddAdminModal(true);
  };

  // Refresh accounts list helper function
  const refreshAccounts = async () => {
    try {
      const data = await getAccounts();
      setAdminId(data.admin_id);

      // Use data directly from GET /accounts
      const allUsers = data.users || [];

      const activeAndInactive = allUsers.filter(
        (user) => user.status !== "pending",
      );
      const pending = allUsers.filter((user) => user.status === "pending");

      setAccounts(activeAndInactive);
      setPendingAccounts(pending);
    } catch (err) {
      console.error("Failed to refresh accounts:", err);
      setError(err.message || "Failed to refresh accounts");
    }
  };

  // Handle save new admin
  const handleSaveAdmin = async (formData) => {
    // Optimistic update - prepare new user object
    const newUser = {
      id: Date.now().toString(), // Temporary ID, will be replaced after fetch
      username: formData.name,
      email: formData.email,
      status: formData.status,
    };

    const previousAccounts = [...accounts];
    const previousPendingAccounts = [...pendingAccounts];

    try {
      // Call the API
      await addUser(formData);

      // Optimistic update
      if (newUser.status !== "pending") {
        setAccounts([...accounts, newUser]);
      } else {
        setPendingAccounts([...pendingAccounts, newUser]);
      }

      setShowAddAdminModal(false);

      // Show success modal
      setSuccessMessage("User added successfully!");
      setShowSuccessModal(true);
      setSuccessTitle("User Added");

      // Verify with server and sync
      await refreshAccounts();
    } catch (err) {
      console.error("Failed to create admin:", err);
      // Rollback on error
      setAccounts(previousAccounts);
      setPendingAccounts(previousPendingAccounts);

      // Handle specific error codes
      if (err.status === 409) {
        setErrorMessage("A user with this email already exists.");
      } else if (err.status === 500) {
        setErrorMessage("Something went wrong. Please try again later.");
      } else {
        setErrorMessage(err.message || "Failed to create admin");
      }
      setShowErrorModal(true);
    }
  };

  // Handle actions menu
  const handleActionsClick = (user, event) => {
    event.stopPropagation();
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    setActionsMenu({
      user,
      position: {
        top: rect.bottom + 8,
        left: rect.right - 180,
      },
    });
  };

  const handleDeleteUser = async (user) => {
    // Show confirmation modal first
    setConfirmConfig({
      title: "Delete User",
      message: `Are you sure you want to delete ${user.username}? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        setShowConfirmModal(false);

        const previousAccounts = [...accounts];
        const previousPendingAccounts = [...pendingAccounts];

        try {
          // Optimistic update - remove from list
          setAccounts(accounts.filter((u) => u.id !== user.id));
          setPendingAccounts(pendingAccounts.filter((u) => u.id !== user.id));

          // Call API
          await deleteUser(user.id);

          // Show success modal
          setSuccessMessage("User deleted successfully!");
          setShowSuccessModal(true);
          setSuccessTitle("User Deleted");

          // Verify with server and sync
          await refreshAccounts();
        } catch (err) {
          console.error("Failed to delete user:", err);
          // Rollback on error
          setAccounts(previousAccounts);
          setPendingAccounts(previousPendingAccounts);

          setErrorMessage(err.message || "Failed to delete user");
          setShowErrorModal(true);
        }
      },
    });
    setShowConfirmModal(true);
  };

  const handleModifyUser = async (user) => {
    // Fetch fresh user data before opening modal
    try {
      const data = await getAccountById(user.id);
      setSelectedUserForUpdate(data.user);
      setShowUpdateUserModal(true);
    } catch (err) {
      console.error("Failed to fetch user details for editing:", err);
      // Fallback to existing user data if fetch fails
      setSelectedUserForUpdate(user);
      setShowUpdateUserModal(true);
    }
  };

  // Handle update user
  const handleUpdateUser = async (userId, formData) => {
    // Find the original user
    const originalUser = accounts.find((u) => u.id === userId);
    if (!originalUser) return;

    // Check if data has changed (double-check)
    const hasChanges =
      formData.name !== originalUser.username ||
      formData.email !== originalUser.email ||
      formData.status !== originalUser.status;

    if (!hasChanges) {
      // No changes, just close modal
      setShowUpdateUserModal(false);
      return;
    }

    // Show confirmation modal first
    setConfirmConfig({
      title: "Update User",
      message: `Are you sure you want to update ${originalUser.username}'s information?`,
      confirmText: "Update",
      variant: "default",
      onConfirm: async () => {
        setShowConfirmModal(false);

        const previousAccounts = [...accounts];

        try {
          // Optimistic update
          const updatedUser = {
            ...originalUser,
            username: formData.name,
            email: formData.email,
            status: formData.status,
          };

          setAccounts(accounts.map((u) => (u.id === userId ? updatedUser : u)));

          // Call API
          await updateUser(userId, {
            name: formData.name,
            email: formData.email,
            status: formData.status,
          });

          setShowUpdateUserModal(false);

          // Show success modal
          setSuccessMessage("User updated successfully!");
          setShowSuccessModal(true);
          setSuccessTitle("User Updated");

          // Verify with server and sync
          await refreshAccounts();
        } catch (err) {
          console.error("Failed to update user:", err);
          // Rollback on error
          setAccounts(previousAccounts);

          setErrorMessage(err.message || "Failed to update user");
          setShowErrorModal(true);
        }
      },
    });
    setShowConfirmModal(true);
  };

  const handleStatusToggle = async (user) => {
    // Optimistic update - update UI immediately
    const previousAccounts = [...accounts];
    const previousPendingAccounts = [...pendingAccounts];

    try {
      // Check if user is trying to deactivate themselves
      if (user.status === "active" && user.id === adminId) {
        // Check if there are other active users
        const activeUsers = accounts.filter(
          (u) => u.status === "active" && u.id !== adminId,
        );

        if (activeUsers.length === 0) {
          setError("Cannot deactivate: At least one active user must remain.");
          return;
        }

        // Show self-deactivate logout modal
        setShowSelfDeactivateModal(true);

        // Optimistic update - remove from active list
        setAccounts(accounts.filter((u) => u.id !== user.id));
        setPendingAccounts([
          ...pendingAccounts,
          { ...user, status: "inactive" },
        ]);

        // Deactivate the current user
        await deactivateUser(user.id);

        // Verify with server
        await refreshAccounts();
        return;
      }

      // For other users, check if deactivating would leave no active users
      if (user.status === "active") {
        const activeUsers = accounts.filter((u) => u.status === "active");

        if (activeUsers.length <= 1) {
          setError("Cannot deactivate: At least one active user must remain.");
          return;
        }
      }

      // Optimistic update
      if (user.status === "active") {
        // Deactivate: move from active to inactive in the same table
        setAccounts(
          accounts.map((u) =>
            u.id === user.id ? { ...u, status: "inactive" } : u,
          ),
        );

        // Call API
        await deactivateUser(user.id);
      } else if (user.status === "pending") {
        // This shouldn't happen in Admins table, but handle it
        setPendingAccounts(pendingAccounts.filter((u) => u.id !== user.id));
        setAccounts([...accounts, { ...user, status: "active" }]);

        // Call API
        await activateUser(user.id);
      } else {
        // Activate: move from inactive to active
        setAccounts(
          accounts.map((u) =>
            u.id === user.id ? { ...u, status: "active" } : u,
          ),
        );

        // Call API
        await activateUser(user.id);
      }

      // Verify with server and sync
      await refreshAccounts();
    } catch (err) {
      console.error("Failed to update user status:", err);
      // Rollback on error
      setAccounts(previousAccounts);
      setPendingAccounts(previousPendingAccounts);
      setError(err.message || "Failed to update user status");
    }
  };

  // Handle accept pending user
  const handleAcceptUser = async (user) => {
    // Optimistic update - move from pending to active immediately
    const previousAccounts = [...accounts];
    const previousPendingAccounts = [...pendingAccounts];

    try {
      // Remove from pending, add to active
      setPendingAccounts(pendingAccounts.filter((u) => u.id !== user.id));
      setAccounts([...accounts, { ...user, status: "active" }]);

      await activateUser(user.id);

      // Verify with server and sync
      await refreshAccounts();
    } catch (err) {
      console.error("Failed to accept user:", err);
      // Rollback on error
      setAccounts(previousAccounts);
      setPendingAccounts(previousPendingAccounts);
      setError(err.message || "Failed to accept user");
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
          {showSelfDeactivateModal && (
            <RotationLogoutModal
              duration={5000}
              title="Account Deactivated"
              message="Your account has been deactivated successfully. You will be logged out automatically."
              subtext="Please contact an administrator to reactivate your account."
              iconName="ban"
            />
          )}

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
              {accountsLoading ? (
                <div className="security-card">
                  <div className="security-card__body">
                    <p>Loading accounts...</p>
                  </div>
                </div>
              ) : (
                <PendingTable
                  accounts={pendingAccounts}
                  searchQuery={pendingSearchQuery}
                  onSearchChange={(value) => setPendingSearchQuery(value)}
                  onUserClick={handleUserClick}
                  onAcceptClick={handleAcceptUser}
                  onDeleteClick={handleDeleteUser}
                />
              )}
            </div>

            <div className="security-grid__full-width">
              {accountsLoading ? (
                <div className="security-card">
                  <div className="security-card__body">
                    <p>Loading accounts...</p>
                  </div>
                </div>
              ) : (
                <AdminsTable
                  accounts={accounts}
                  adminId={adminId}
                  searchQuery={adminsSearchQuery}
                  onSearchChange={(value) => setAdminsSearchQuery(value)}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  onUserClick={handleUserClick}
                  onActionsClick={handleActionsClick}
                  onAddClick={handleAddAdminClick}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showAddAdminModal && (
        <AddAdminModal
          onClose={() => setShowAddAdminModal(false)}
          onSave={handleSaveAdmin}
        />
      )}

      {showUpdateUserModal && selectedUserForUpdate && (
        <UpdateUserModal
          user={selectedUserForUpdate}
          onClose={() => {
            setShowUpdateUserModal(false);
            setSelectedUserForUpdate(null);
          }}
          onSave={handleUpdateUser}
        />
      )}

      {showProfileModal && selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {actionsMenu && (
        <ActionsMenu
          user={actionsMenu.user}
          position={actionsMenu.position}
          onClose={() => setActionsMenu(null)}
          onDelete={handleDeleteUser}
          onModify={handleModifyUser}
          onStatusToggle={handleStatusToggle}
        />
      )}

      {showConfirmModal && confirmConfig && (
        <ConfirmModal
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          cancelText="Cancel"
          onConfirm={confirmConfig.onConfirm}
          onCancel={() => setShowConfirmModal(false)}
          variant={confirmConfig.variant || "default"}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          message={successMessage}
          title={successTitle}
          onDismiss={() => setShowSuccessModal(false)}
          duration={4000}
        />
      )}

      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onDismiss={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
}
