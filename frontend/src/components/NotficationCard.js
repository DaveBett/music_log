import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

export default function NotificationCard({ notification, close }) {
  const { user: currentUser } = useAuth();

  const { type, data, actor, read, created_at } = notification;

  const getProfilePath = (username) => {
    return currentUser?.username === username
      ? "/profile"
      : `/user/${username}`;
  };

  return (
    <div className={`notification-card ${read ? "" : "unread"}`}>
      <Avatar src={actor.avatar_url} username={actor.username} size={36} />

      <div className="notification-content">
        <Link
          to={getProfilePath(actor.username)}
          className="notification-actor"
          onClick={close}
        >
          <strong>{actor.username}</strong>
        </Link>

        {type === "follow" && (
          <p>followed you</p>
        )}

        {type === "comment_on_review" && (
          <p>
            commented on your review of{" "}
            <Link
              to={`/reviews/${data.review_id}`}
              className="notification-link"
              onClick={close}
            >
              <strong>{data.album}</strong>
            </Link>
          </p>
        )}

        {type === "comment_on_commented_review" && (
          <p>
            also commented on{" "}
            <Link
              to={`/reviews/${data.review_id}`}
              className="notification-link"
              onClick={close}
            >
              a review you commented on
            </Link>
          </p>
        )}

        {type === "review_on_logged_entry" && (
          <p>
            reviewed{" "}
            <Link
              to={`/reviews/${data.review_id}`}
              className="notification-link"
              onClick={close}
            >
              <strong>{data.album}</strong>
            </Link>
            , an album you logged
          </p>
        )}

        <span className="notification-date">
          {formatNotificationDate(created_at)}
        </span>
      </div>
    </div>
  );
}

function formatNotificationDate(date) {
  const notificationDate = new Date(date);
  const now = new Date();
  const difference = Math.floor((now - notificationDate) / 1000);

  if (difference < 60) return "Just now";
  if (difference < 3600) return `${Math.floor(difference / 60)} minutes ago`;
  if (difference < 86400) return `${Math.floor(difference / 3600)} hours ago`;
  if (difference < 172800) return "Yesterday";

  return notificationDate.toLocaleDateString();
}