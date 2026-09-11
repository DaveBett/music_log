import { useState } from "react";
import Avatar from "../Avatar";
import FollowListModal from "./FollowListModal";
import { getFollowers, getFollowing } from "../../api/endpoints";

export default function PublicProfileHeader({
  user,
  stats,
  following,
  onFollow
}) {
  const [justChanged, setJustChanged] = useState(false);
  const [modalType, setModalType] = useState(null); // "followers" | "following" | null
  const [modalUsers, setModalUsers] = useState([]);

  const handleClick = async () => {
    await onFollow();
    setJustChanged(true);
    setTimeout(() => setJustChanged(false), 400);
  };

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

  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="profile-header">
      <div>
        <Avatar src={user.avatar_url} username={user.username} size={120} />
      </div>

      <div className="profile-info">
        <div className="public-profile-user">
          <h1>{user?.username}</h1>

          <button
            className={`follow-button ${following ? "following" : "not-following"} ${justChanged ? "pulse" : ""}`}
            onClick={handleClick}
          >
            {following ? "Unfollow" : "Follow"}
          </button>
        </div>

        <div><br></br></div>

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
