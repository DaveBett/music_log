import { useEffect, useState } from "react";
import { searchMusicBrainz } from "../api/endpoints";

import AlbumSearchModal from "./AlbumSearchModal";

const AddEntry = ({
  addEntry,
  updateEntry,
  editingEntry,
  setEditingEntry
}) => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("artist");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searching, setSearching] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalResults, setModalResults] = useState([]);

  useEffect(() => {
    if (!editingEntry) {
      setQuery("");
      setSelectedAlbum(null);
      return;
    }

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

    setSuccessMessage("");
    setErrorMessage("");
  }, [editingEntry]);

  async function handleSearch() {
    if (!query.trim()) return;

    try {
      setSuccessMessage("");
      setErrorMessage("");
      setSearching(true);

      const albums = await searchMusicBrainz(query, mode);

      setModalResults(albums);
      setModalOpen(true);
    } catch (error) {
      console.error("MusicBrainz search failed:", error);
      setErrorMessage("Unable to search for albums. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  const handleSelectAlbum = (album) => {
    setSelectedAlbum(album);
    setQuery(`${album.artist} - ${album.title}`);
    setModalOpen(false);
  };

  const handleAddAlbum = async (album) => {
    await addEntry(
      album.artist,
      album.title,
      album.year,
      album.musicbrainzId,
      album.musicbrainzUrl
    );
  };

  const handleSubmit = async () => {
    if (!selectedAlbum || !editingEntry) return;

    setSuccessMessage("");
    setErrorMessage("");

    try {
      await updateEntry(
        editingEntry.id,
        selectedAlbum.artist,
        selectedAlbum.title,
        selectedAlbum.year,
        selectedAlbum.musicbrainzId,
        selectedAlbum.musicbrainzUrl
      );

      setSuccessMessage("Album updated successfully.");
      setQuery("");
      setSelectedAlbum(null);
      setEditingEntry(null);
    } catch (error) {
      console.error(error);

      const errors = error.response?.data?.errors || [];

      if (
        errors.some((error) =>
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
    setSelectedAlbum(null);
    setEditingEntry(null);
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <div className="add-entry">
      <div className="add-entry-search">
        <div className="mode-toggle">
          <button
            type="button"
            className={`mode-toggle-option ${mode === "artist" ? "active" : ""}`}
            onClick={() => setMode("artist")}
          >
            Artist
          </button>
          
          <button
            type="button"
            className={`mode-toggle-option ${mode === "album" ? "active" : ""}`}
            onClick={() => setMode("album")}
          >
            Album
          </button>
        </div>
        <input
          id = "add-entry"
          className="auth-input"
          type="text"
          value={query}
          placeholder={
            mode === "artist"
              ? "Search by artist name..."
              : "Search by album title..."
          }
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSearch();
            }
          }}
        />

        <button
          className="add-button"
          onClick={handleSearch}
          disabled={searching || !query.trim()}
        >
          {searching ? "Searching..." : "Search"}
        </button>

        {editingEntry && (
          <>
            <button
              className="add-button"
              onClick={handleSubmit}
              disabled={!selectedAlbum}
            >
              Update
            </button>

            <button className="cancel-button" onClick={cancelEdit}>
              Cancel
            </button>
          </>
        )}
      </div>

      <div className="entry-message">
        {successMessage && (
          <div className="entry-success" role="status" aria-live="polite">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="entry-error" role="alert">
            {errorMessage}
          </div>
        )}
      </div>

      {modalOpen && (
        <AlbumSearchModal
          results={modalResults}
          isEditing={!!editingEntry}
          onSelect={handleSelectAlbum}
          onAdd={handleAddAlbum}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AddEntry;