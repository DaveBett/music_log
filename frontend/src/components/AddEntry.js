import { useEffect, useRef, useState } from "react";
import { searchMusicBrainz } from "../api/endpoints";

const AddEntry = ({
  addEntry,
  updateEntry,
  editingEntry,
  setEditingEntry
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searching, setSearching] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isEditingRef = useRef(false);

  /*
   * Populate the form when editing an existing entry.
   *
   * This should NOT run every time the search query changes.
   */

  useEffect(() => {
    if (!editingEntry) {
      isEditingRef.current = false;

      setQuery("");
      setResults([]);
      setSelectedAlbum(null);

      return;
    }

    isEditingRef.current = true;

    setQuery(
      `${editingEntry.artist} - ${editingEntry.title}`
    );

    setSelectedAlbum({
      title: editingEntry.title,
      artist: editingEntry.artist,
      year: editingEntry.year,
      musicbrainzId: editingEntry.musicbrainz_id,
      musicbrainzUrl: editingEntry.musicbrainz_url
    });

    setResults([]);
    setSuccessMessage("");
    setErrorMessage("");
  }, [editingEntry?.id]);

  /*
   * Debounced MusicBrainz search.
   */
  useEffect(() => {
    // Don't search an empty query.
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }

    // If an album has just been selected, don't search
    // the formatted "Artist - Album" value.
    if (selectedAlbum) {
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setSuccessMessage("");
        setErrorMessage("");
        setSearching(true);

        const albums = await searchMusicBrainz(query);

        setResults(albums);
      } catch (error) {
        console.error(
          "MusicBrainz search failed:",
          error,
          setErrorMessage(
            "Unable to search for albums. Please try again."
          )
        );

        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, selectedAlbum]);

  const handleSelectAlbum = (album) => {
    setSelectedAlbum(album);

    setQuery(
      `${album.artist} - ${album.title}`
    );

    setSearching(false);

    setResults([]);
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    if (!selectedAlbum) return;
  
    setSuccessMessage("");
    setErrorMessage("");
  
    try {
      if (editingEntry) {
        await updateEntry(
          editingEntry.id,
          selectedAlbum.artist,
          selectedAlbum.title,
          selectedAlbum.year,
          selectedAlbum.musicbrainzId,
          selectedAlbum.musicbrainzUrl
        );
  
        setSuccessMessage("Album updated successfully.");
      } else {
        await addEntry(
          selectedAlbum.artist,
          selectedAlbum.title,
          selectedAlbum.year,
          selectedAlbum.musicbrainzId,
          selectedAlbum.musicbrainzUrl
        );
  
        setSuccessMessage("Album added successfully.");
      }
  
      setQuery("");
      setResults([]);
      setSelectedAlbum(null);
      setEditingEntry(null);
  
    } catch (error) {
      console.error(error);
  
      const errors = error.response?.data?.errors || [];
  
      if (
        errors.some(error =>
          error.toLowerCase().includes("already in your catalog")
        )
      ) {
        setErrorMessage("This album is already in your catalog.");
      } else {
        setErrorMessage("Unable to save album.");
      }
    }
  };

  const cancelEdit = () => {
    setQuery("");
    setResults([]);
    setSelectedAlbum(null);
    setEditingEntry(null);
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <div className="add-entry">
      <div className="add-entry-search">
        <input
          className="auth-input"
          type="text"
          value={query}
          placeholder="Search artist or album..."
          onChange={(event) => {
            setQuery(event.target.value);

            // This is important:
            // changing the query means the previously
            // selected album is no longer selected.
            setSelectedAlbum(null);
          }}
        />

        <button
          className="add-button"
          onClick={handleSubmit}
          disabled={!selectedAlbum}
        >
          {editingEntry ? "Update Album" : "Add Album"}
        </button>
        
        {editingEntry && (
          <button
            className="cancel-button"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}
      </div>

      {searching && (
        <div className="musicbrainz-searching">
          Searching...
        </div>
      )}

      <div className="entry-message">
        {successMessage && (
          <div
            className="entry-success"
            role="status"
            aria-live="polite"
          >
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div
            className="entry-error"
            role="alert"
          >
            {errorMessage}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="musicbrainz-results">
          {results.map((album) => (
            <button
              key={album.musicbrainzId}
              className="musicbrainz-result"
              onClick={() => handleSelectAlbum(album)}
            >
              <strong>{album.title}</strong>

              <span>
                {album.artist}
                {album.year
                  ? ` · ${album.year}`
                  : ""}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddEntry;