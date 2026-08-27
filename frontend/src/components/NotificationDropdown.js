import NotificationCard from "./NotficationCard";

export default function NotificationDropdown({ notifications, close }) {
  if (notifications.length === 0) {
    return (
      <div className="notification-dropdown">
        <p className="notification-empty">No notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="notification-dropdown">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          close={close}
        />
      ))}
    </div>
  );
}