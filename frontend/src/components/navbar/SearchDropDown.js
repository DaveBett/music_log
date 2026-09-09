import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../Avatar";

export default function SearchDropdown({ results, close }) {
  const { user: currentUser } = useAuth();

  const users = results?.users || [];
  const artists = results?.artists || [];
  const albums = results?.albums || [];

  const hasResults = users.length > 0 || artists.length > 0 || albums.length > 0;

  const getProfilePath = (username) => {
    return currentUser?.username === username
      ? "/profile"
      : `/user/${username}`;
  };

  if (!hasResults) {
    return (
      <div className="search-dropdown">
        <p className="search-empty">
          No results found.
        </p>
      </div>
    );
  }

  return (
    <div className="search-dropdown">
      {users.length > 0 && (
        <div className="search-dropdown-section">
          <span className="search-dropdown-label">Users</span>

          {users.map((user) => (
            <Link
              key={user.id}
              to={getProfilePath(user.username)}
              className="search-result"
              onClick={close}
            >
              <Avatar src={user.avatar_url} username={user.username} size={36} />
              <span>{user.username}</span>
            </Link>
          ))}
        </div>
      )}

      {artists.length > 0 && (
        <div className="search-dropdown-section">
          <span className="search-dropdown-label">Artists</span>

          {artists.map((item) => (
            <Link
              key={item.artist}
              to={`/artist/${encodeURIComponent(item.artist)}`}
              state={{ from: window.location.pathname }}
              className="search-result"
              onClick={close}
            >
              <span>{item.artist}</span>
            </Link>
          ))}
        </div>
      )}

      {albums.length > 0 && (
        <div className="search-dropdown-section">
          <span className="search-dropdown-label">Albums</span>

          {albums.map((item) => (
            <Link
              key={item.musicbrainz_id}
              to={`/album/${item.musicbrainz_id}`}
              state={{ from: window.location.pathname }}
              className="search-result"
              onClick={close}
            >
              <span>{item.title}</span>
              <small>{item.artist}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}