import { useState } from "react";
import Avatar from "../Avatar";
import FollowListModal from "../publicProfile/FollowListModal";
import { getFollowers, getFollowing } from "../../api/endpoints";

export default function ProfileHeader({
  user,
  stats,
  isOwnProfile,
}) {
  const [modalType, setModalType] = useState(null);
  const [modalUsers, setModalUsers] = useState([]);

  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : null;

  async function openModal(type) {
    try {
      const data =
        type === "followers"
          ? await getFollowers(user.username)
          : await getFollowing(user.username);

      setModalUsers(data);
      setModalType(type);
    } catch (err) {
      console.error("Unable to load list:", err);
    }
  }

  return (
    <div className="profile-header">
      <div className="profile-avatar">
        <Avatar src={user.avatar_url} username={user.username} size={120} />
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

          <button
            className="profile-stat profile-stat-clickable"
            onClick={() => openModal("followers")}
          >
            <strong>{stats?.followers ?? 0}</strong>
            <span>Followers</span>
          </button>

          <button
            className="profile-stat profile-stat-clickable"
            onClick={() => openModal("following")}
          >
            <strong>{stats?.following ?? 0}</strong>
            <span>Following</span>
          </button>

        </div>
      </div>

      {modalType && (
        <FollowListModal
          title={modalType === "followers" ? "Followers" : "Following"}
          users={modalUsers}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
}