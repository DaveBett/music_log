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

  return (
    <div className="profile-header">
      <Avatar src={user.avatar_url} username={user.username} size={120} />
      <div className="profile-text">
      <h1>{user.username}</h1>

      <div className="profile-follow-stats">
        <button className="stat-link" onClick={() => openModal("followers")}>
          <strong>{stats?.followers ?? 0}</strong> Followers
        </button>
        <button className="stat-link" onClick={() => openModal("following")}>
          <strong>{stats?.following ?? 0}</strong> Following
        </button>
      </div>
      </div>

      <button
        className={`follow-button ${following ? "following" : "not-following"} ${justChanged ? "pulse" : ""}`}
        onClick={handleClick}
      >
        {following ? "Unfollow" : "Follow"}
      </button>

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