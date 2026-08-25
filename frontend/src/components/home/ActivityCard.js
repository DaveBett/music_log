import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../Avatar";

export default function ActivityCard({ activity }) {
  const { user: currentUser } = useAuth();

  const {
    user,
    type,
    data,
    created_at,
  } = activity;

  const getProfilePath = (username) => {
    return currentUser?.username === username
      ? "/profile"
      : `/user/${username}`;
  };

  return (
    <article className="activity-card">
      <Avatar src={user.avatar_url} username={user.username} size={42} />
      <div className="activity-content">
      <Link to={getProfilePath(user.username)} className="activity-user">
        <strong>{user.username}</strong>
      </Link>

        {type === "log" && (
          <p>
            logged{" "}
            <strong>
              {data.album}
            </strong>
            {" by "}
            {data.artist}
          </p>
        )}

        {type === "review" && (
          <p>
            reviewed{" "}

            <Link to={`/reviews/${data.review_id}`} className="activity-review-link">
              <strong>
                {data.album}
              </strong>
              {" by "}
              {data.artist}
            </Link>
          </p>
        )}

        {type === "follow" && (
          <p>
            followed{" "}
            <Link to={getProfilePath(data.username)} className="activity-user">
              <strong>{data.username}</strong>
            </Link>
          </p>
        )}

        {type === "comment" && (
        <p>
          commented on{" "}
          <Link to={getProfilePath(data.review_author_username)} className="activity-user">
            <strong>{data.review_author_username}</strong>
          </Link>
          {"'s review of "}
          <Link to={`/reviews/${data.review_id}`} className="activity-review-link">
            <strong>{data.album}</strong>
          </Link>
        </p>
        )}
      </div>

      <span>
        {formatActivityDate(created_at)}
      </span>
    </article>
  );
}

function formatActivityDate(date) {
  const activityDate = new Date(date);
  const now = new Date();

  const difference =
    Math.floor(
      (now - activityDate) / 1000
    );

  if (difference < 60) {
    return "Just now";
  }

  if (difference < 3600) {
    return `${Math.floor(
      difference / 60
    )} minutes ago`;
  }

  if (difference < 86400) {
    return `${Math.floor(
      difference / 3600
    )} hours ago`;
  }

  if (difference < 172800) {
    return "Yesterday";
  }

  return activityDate.toLocaleDateString();
}