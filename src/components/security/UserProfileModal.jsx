import { Icon } from "../ui/Icons.jsx";

export function UserProfileModal({ user, onClose }) {
  if (!user) return null;

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

  const getStatusBadgeClass = (status) => {
    const baseClass = "badge badge--soft";
    if (status === "inactive") {
      return `${baseClass} badge--danger`;
    }
    if (status === "pending") {
      return `${baseClass} badge--warning`;
    }
    return baseClass;
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-content modal-content--medium"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">User Profile</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon name="close" className="modal-close-icon" />
          </button>
        </div>

        <div className="modal-body">
          <div className="user-profile">
            <div className="user-profile__avatar">
              <span className="user-profile__avatar-text">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>

            <div className="user-profile__info">
              <div className="user-profile__field">
                <label className="user-profile__label">Name</label>
                <p className="user-profile__value">{user.username || "N/A"}</p>
              </div>

              <div className="user-profile__field">
                <label className="user-profile__label">Email</label>
                <p className="user-profile__value">{user.email || "N/A"}</p>
              </div>

              <div className="user-profile__field">
                <label className="user-profile__label">Status</label>
                <span className={getStatusBadgeClass(user.status)}>
                  {user.status || "N/A"}
                </span>
              </div>

              <div className="user-profile__field">
                <label className="user-profile__label">User ID</label>
                <p className="user-profile__value user-profile__value--mono">
                  {user.id}
                </p>
              </div>

              {user.iat && (
                <div className="user-profile__field">
                  <label className="user-profile__label">Created At</label>
                  <p className="user-profile__value">
                    {formatDateTime(user.iat)}
                  </p>
                </div>
              )}

              {user.exp && (
                <div className="user-profile__field">
                  <label className="user-profile__label">Expires At</label>
                  <p className="user-profile__value">
                    {formatDateTime(user.exp)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="primary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
