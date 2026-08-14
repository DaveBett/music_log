import { FaUserCircle } from "react-icons/fa";

export default function ProfileHeader({
  user,
  stats,
  isOwnProfile,
}) {
  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="profile-header">
      <div className="profile-avatar">
        <FaUserCircle size={90} />
      </div>

      <div className="profile-info">
        <h1>{user?.username}</h1>

        {isOwnProfile && (
          <p className="profile-email">
            {user?.email}
          </p>
        )}

        {joined && (
          <p className="profile-joined">
            Joined {joined}
          </p>
        )}

        <div className="profile-meta">

          <div className="profile-stat">
            <strong>{stats?.logs ?? 0}</strong>
            <span>Albums</span>
          </div>

          <div className="profile-stat">
            <strong>{stats?.reviews ?? 0}</strong>
            <span>Reviews</span>
          </div>

          <div className="profile-stat">
            <strong>{stats?.followers ?? 0}</strong>
            <span>Followers</span>
          </div>

          <div className="profile-stat">
            <strong>{stats?.following ?? 0}</strong>
            <span>Following</span>
          </div>

        </div>
      </div>
    </div>
  );
}