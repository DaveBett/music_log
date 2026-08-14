import { Link } from "react-router-dom";

export default function ActivityCard({ activity }) {
  const {
    user,
    type,
    data,
    created_at
  } = activity;

  return (
    <article className="activity-card">

      <div className="activity-avatar">
      </div>

      <div className="activity-content">

        <Link
          to={`/user/${user.username}`}
          className="activity-user"
        >
          <strong>
            {user.username}
          </strong>
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

            <Link
              to={`/reviews/${data.review_id}`}
              className="activity-review-link"
            >
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

            <Link
              to={`/user/${data.user_id}`}
            >
              <strong>
                {data.username}
              </strong>
            </Link>
          </p>
        )}

        <span>
          {formatActivityDate(
            created_at
          )}
        </span>

      </div>

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