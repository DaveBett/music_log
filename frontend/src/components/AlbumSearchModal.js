import { useMemo, useState } from "react";
import { getAlbumCoverUrl } from "../api/endpoints";

export default function AlbumSearchModal({
  results,
  isEditing,
  onSelect,
  onAdd,
  onClose
}) {
  const [filter, setFilter] = useState("");
  const [addedIds, setAddedIds] = useState(new Set());
  const [addingId, setAddingId] = useState(null);
  const [errorId, setErrorId] = useState(null);

  const filteredResults = useMemo(() => {
    const normalized = filter.trim().toLowerCase();
    if (!normalized) return results;

    return results.filter((album) => {
      const haystack = `${album.artist} ${album.title}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [filter, results]);

  async function handleAddClick(album) {
    setErrorId(null);

    if (isEditing) {
      onSelect(album);
      return;
    }

    try {
      setAddingId(album.musicbrainzId);
      await onAdd(album);
      setAddedIds((current) => new Set(current).add(album.musicbrainzId));
    } catch (error) {
      console.error("Unable to add album:", error);
      setErrorId(album.musicbrainzId);
    } finally {
      setAddingId(null);
    }
  }

  return (
    <div className="album-modal-overlay" onClick={onClose}>
      <div className="album-modal" onClick={(e) => e.stopPropagation()}>
        <div className="album-modal-header">
          <h3>{isEditing ? "Select an album" : "Search results"}</h3>
          <button className="album-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <input
          className="auth-input album-modal-filter"
          type="text"
          placeholder="Filter results..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <div className="album-modal-list">
          {filteredResults.length === 0 ? (
            <p className="album-modal-empty">No results match your filter.</p>
          ) : (
            filteredResults.map((album) => {
              const coverUrl = getAlbumCoverUrl(album.musicbrainzId);
              const isAdded = addedIds.has(album.musicbrainzId);
              const isAdding = addingId === album.musicbrainzId;
              const hasError = errorId === album.musicbrainzId;

              return (
                <div key={album.musicbrainzId} className="album-modal-item">
                  {coverUrl && (
                    <img
                      className="album-modal-cover"
                      src={coverUrl}
                      alt={`${album.title} cover`}
                    />
                  )}

                  <div className="album-modal-info">
                    <strong>{album.title}</strong>
                    <span>
                      {album.artist}
                      {album.year ? ` · ${album.year}` : ""}
                    </span>
                    {hasError && (
                      <span className="album-modal-error">
                        Unable to add. It may already be in your catalog.
                      </span>
                    )}
                  </div>

                  <button
                    className="album-modal-add-button"
                    onClick={() => handleAddClick(album)}
                    disabled={isAdding || (isAdded && !isEditing)}
                  >
                    {isEditing
                      ? "Select"
                      : isAdded
                      ? "Added ✓"
                      : isAdding
                      ? "Adding..."
                      : "Add"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}