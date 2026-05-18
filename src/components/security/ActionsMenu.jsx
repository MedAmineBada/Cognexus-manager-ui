import { useEffect, useRef, useState } from "react";
import { Icon } from "../ui/Icons.jsx";

export function ActionsMenu({
  user,
  position,
  onClose,
  onDelete,
  onModify,
  onStatusToggle,
}) {
  const menuRef = useRef(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    // Calculate if menu would go off-screen
    if (menuRef.current) {
      const menuHeight = menuRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - position.top;

      // If not enough space below, open upward
      if (spaceBelow < menuHeight + 20) {
        setAdjustedPosition({
          top: position.top - menuHeight - 16, // 16px gap above button
          left: position.left,
        });
      } else {
        setAdjustedPosition(position);
      }
    }
  }, [position]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleDelete = () => {
    onDelete(user);
    onClose();
  };

  const handleModify = () => {
    onModify(user);
    onClose();
  };

  const handleStatusToggle = () => {
    onStatusToggle(user);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="actions-menu"
      style={{
        top: adjustedPosition.top,
        left: adjustedPosition.left,
      }}
    >
      <button
        type="button"
        className="actions-menu__item"
        onClick={handleModify}
      >
        <Icon name="edit" className="actions-menu__icon" />
        <span>Modify</span>
      </button>

      <button
        type="button"
        className="actions-menu__item"
        onClick={handleStatusToggle}
      >
        <Icon
          name={user.status === "active" ? "ban" : "check-circle"}
          className="actions-menu__icon"
        />
        <span>{user.status === "active" ? "Deactivate" : "Activate"}</span>
      </button>

      <div className="actions-menu__divider" />

      <button
        type="button"
        className="actions-menu__item actions-menu__item--danger"
        onClick={handleDelete}
      >
        <Icon name="trash" className="actions-menu__icon" />
        <span>Delete</span>
      </button>
    </div>
  );
}
