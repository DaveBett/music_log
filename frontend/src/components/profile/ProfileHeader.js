import { useRef, useState } from "react";
import Avatar from "../Avatar";
import FollowListModal from "../publicProfile/FollowListModal";
import { getFollowers, getFollowing, updateAvatar } from "../../api/endpoints";
import { MdOutlineModeEdit } from "react-icons/md";

export default function ProfileHeader({
  user,
  stats,
  isOwnProfile = false,
  onAvatarUpdated
}) {
  const [modalType, setModalType] = useState(null);
  const [modalUsers, setModalUsers] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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

  function handleAvatarClick() {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  }

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = await updateAvatar(file);
      onAvatarUpdated?.(data.avatar_url);
    } catch (err) {
      console.error("Unable to update avatar:", err);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="profile-header">
      <div
        className={`profile-avatar ${isOwnProfile ? "profile-avatar-editable" : ""}`}
        onClick={handleAvatarClick}
      >
        <Avatar src={user.avatar_url} username={user.username} size={120} />

        {isOwnProfile && (
          <div className="profile-avatar-overlay">
            {uploading ? (
              <span className="profile-avatar-uploading">...</span>
            ) : (
              <MdOutlineModeEdit size="24px" />
            )}
          </div>
        )}

        {isOwnProfile && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            className="profile-avatar-input"
          />
        )}
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