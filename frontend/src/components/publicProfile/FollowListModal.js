import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../Avatar";

export default function FollowListModal({ title, users, onClose }) {
  const { user: currentUser } = useAuth();

  const getProfilePath = (username) => {
    return currentUser?.username === username
      ? "/profile"
      : `/user/${username}`;
  };

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
            users.map((user) => (
              <Link
                key={user.id}
                to={getProfilePath(user.username)}
                className="follow-modal-item"
                onClick={onClose}
              >
                <Avatar src={user.avatar_url} username={user.username} size={36} />
                <span>{user.username}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}