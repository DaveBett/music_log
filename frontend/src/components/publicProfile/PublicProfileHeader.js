import Avatar from "../Avatar";

export default function PublicProfileHeader({
  user,
  following,
  onFollow
}) {
  return (
    <div className="profile-header">
      <Avatar src={user.avatar_url} username={user.username} size={120}/>
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