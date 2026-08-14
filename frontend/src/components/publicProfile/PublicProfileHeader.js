import { FaUserCircle } from "react-icons/fa";

export default function PublicProfileHeader({
  user,
  following,
  onFollow
}) {
  return (
    <div className="profile-header">
      <FaUserCircle className="profile-avatar" size="50px" />
      <h1>{user.username}</h1>

      <button
        className={following ? "follow-button secondary-button" : " follow-button primary-button"}
        onClick={onFollow}
      >
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
}