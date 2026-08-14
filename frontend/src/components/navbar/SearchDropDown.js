import { Link } from "react-router-dom";

export default function SearchDropdown({ results, close }) {

  return (
    <div className="search-dropdown">

      {results.users.length > 0 && (
        <>
          <h4>Users</h4>

          {results.users.map(user => (
            <Link
              key={user.id}
              to={`/user/${user.username}`}
              onClick={close}
              className="search-item"
            >
            {user.username}
            </Link>
          ))}
        </>
      )}

      {results.artists.length > 0 && (
        <>
          <h4>Artists</h4>

          {results.artists.map(artist => (
            <div
              key={artist}
              className="search-item"
            >
              {artist}
            </div>
          ))}
        </>
      )}

      {results.albums.length > 0 && (
        <>
          <h4>Albums</h4>

          {results.albums.map(album => (
            <div
              key={`${album.artist}-${album.title}`}
              className="search-item"
            >
              {album.title}
              <span>{album.artist}</span>
            </div>
          ))}
        </>
      )}

      {results.users.length === 0 &&
       results.artists.length === 0 &&
       results.albums.length === 0 && (
        <div className="search-empty">
          No results.
        </div>
      )}

    </div>
  );
}