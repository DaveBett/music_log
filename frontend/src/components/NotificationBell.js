import { useEffect, useRef, useState } from "react";
import { getNotifications, markNotificationsRead } from "../api/endpoints";
import { FaRegBell } from "react-icons/fa";

import NotificationDropdown from "./NotificationDropdown";

const POLL_INTERVAL = 30000;

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const intervalRef = useRef(null);

  async function fetchNotifications() {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch (err) {
      console.error("Unable to fetch notifications:", err);
    }
  }

  useEffect(() => {
    fetchNotifications();

    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, []);

  async function handleToggle() {
    const wasOpen = open;
    setOpen(!open);

    if (!wasOpen && unreadCount > 0) {
      try {
        await markNotificationsRead();
        setUnreadCount(0);
        setNotifications((current) =>
          current.map((n) => ({ ...n, read: true }))
        );
      } catch (err) {
        console.error("Unable to mark notifications read:", err);
      }
    }
  }

  return (
    <div className="notification-bell-container">
      <button
        className="notification-bell-button"
        onClick={handleToggle}
        aria-label="Notifications"
      >
        <FaRegBell color="white"/>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          close={() => setOpen(false)}
        />
      )}
    </div>
  );
}