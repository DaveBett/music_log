import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { followUser, unfollowUser } from "../../api/endpoints";
import Avatar from "../Avatar";

export default function FollowListModal({ title, users, onClose }) {
  const { user: currentUser } = useAuth();
  const [followingState, setFollowingState] = useState(
    () => new Map(users.map((u) => [u.id, u.following]))
  );
  const [pendingIds, setPendingIds] = useState(new Set());

  const getProfilePath = (username) => {
    return currentUser?.username === username
      ? "/profile"
      : `/user/${username}`;
  };

  async function handleFollowToggle(user) {
    const isFollowing = followingState.get(user.id);

    setPendingIds((current) => new Set(current).add(user.id));

    try {
      if (isFollowing) {
        await unfollowUser(user.id);
      } else {
        await followUser(user.id);
      }

      setFollowingState((current) => {
        const next = new Map(current);
        next.set(user.id, !isFollowing);
        return next;
      });
    } catch (err) {
      console.error("Unable to update follow status:", err);
    } finally {
      setPendingIds((current) => {
        const next = new Set(current);
        next.delete(user.id);
        return next;
      });
    }
  }

  return (
    <div className="follow-modal-overlay" onClick={onClose}>
      <div className="follow-modal" onClick={(e) => e.stopPropagation()}>
        <div className="follow-modal-header">
          <h3>{title}</h3>
          <button className="follow-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="follow-modal-list">
          {users.length === 0 ? (
            <p className="follow-modal-empty">No users to show.</p>
          ) : (
            users.map((user) => {
              const isOwnRow = currentUser?.username === user.username;
              const isFollowing = followingState.get(user.id);
              const isPending = pendingIds.has(user.id);

              return (
                <div key={user.id} className="follow-modal-item">
                  <Link
                    to={getProfilePath(user.username)}
                    className="follow-modal-item-link"
                    onClick={onClose}
                  >
                    <Avatar src={user.avatar_url} username={user.username} size={36} />
                    <span>{user.username}</span>
                  </Link>

                  {!isOwnRow && (
                    <button
                      className={`follow-modal-follow-button ${
                        isFollowing ? "following" : "not-following"
                      }`}
                      onClick={() => handleFollowToggle(user)}
                      disabled={isPending}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}