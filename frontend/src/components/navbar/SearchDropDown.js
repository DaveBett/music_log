import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../Avatar";

export default function SearchDropdown({ results, close }) {
  const { user: currentUser } = useAuth();

  const users = results?.users || [];

  if (users.length === 0) {
    return (
      <div className="search-dropdown">
        <p className="search-empty">
          No users found.
        </p>
      </div>
    );
  }

  const getProfilePath = (username) => {
    return currentUser?.username === username
      ? "/profile"
      : `/user/${username}`;
  };

  return (
    <div className="search-dropdown">
      {users.map((user) => (
        <Link key={user.id} to={getProfilePath(user.username)} className="search-result" onClick={close}>
          <Avatar src={user.avatar_url} username={user.username} size={36}/>
          <span>{user.username}</span>
        </Link>
      ))}
    </div>
  );
}