import { useState } from "react";
import { searchMusicBrainz } from "../api/endpoints";

export default function AlbumSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearching(true);
    setError("");

    try {
      const albums = await searchMusicBrainz(query);
      setResults(albums);
    } catch (err) {
      setError("Unable to search for albums.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="album-search">
      <label>
        Search album
      </label>

      <div className="album-search-input">
        <input
          className="auth-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Artist or album name"
        />

        <button
          type="button"
          className="auth-button"
          onClick={handleSearch}
          disabled={searching}
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="album-search-results">
        {results.map((album) => (
          <button
            type="button"
            key={album.id}
            onClick={() => onSelect(album)}
          >
            <strong>{album.title}</strong>
            <span>
              {album.artist}
              {album.first_release_date &&
                ` · ${album.first_release_date.slice(0, 4)}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}