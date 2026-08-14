export default function UserStatsSection({stats}) {
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
        <span>—</span>
      </div>

      <div className="stat-card">
        <h3>Favorite Artist</h3>
        <span>—</span>
      </div>

      <div className="stat-card">
        <h3>Favorite Genre</h3>
        <span>—</span>
      </div>

      <div className="stat-card">
        <h3>This Year's Logs</h3>
        <span>0</span>
      </div>

    </div>
  );
}