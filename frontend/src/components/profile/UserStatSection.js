export default function UserStatSection({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Albums Logged</h3>
        <span>{stats?.logs ?? 0}</span>
      </div>

      <div className="stat-card">
        <h3>Reviews Written</h3>
        <span>{stats?.reviews ?? 0}</span>
      </div>

      <div className="stat-card">
        <h3>Average Rating</h3>
        <span>
          {stats?.average_rating != null
            ? `${Number(stats.average_rating).toFixed(1)}`
            : "-"}
        </span>
        {console.log(stats.average_rating)}
      </div>

      <div className="stat-card">
        <h3>Most Logged Artist</h3>
        <span>
          {stats?.most_logged_artist || "-"}
        </span>
      </div>

      <div className="stat-card">
        <h3>Favorite Genre</h3>
        <span>
          {stats?.favorite_genre || "-"}
        </span>
      </div>

      <div className="stat-card">
        <h3>This Year's Logs</h3>
        <span>
          {stats?.this_year_logs ?? 0}
        </span>
      </div>

    </div>
  );
}