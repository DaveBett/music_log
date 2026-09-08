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
  const [addingIds, setAddingIds] = useState(new Set());
  const [errorId, setErrorId] = useState(null);

  const filteredResults = useMemo(() => {
    const normalized = filter.trim().toLowerCase();
  
    const base = normalized
      ? results.filter((album) => {
          const haystack = `${album.artist} ${album.title}`.toLowerCase();
          return haystack.includes(normalized);
        })
      : results;
  
    return [...base].sort((a, b) => {
      const yearA = parseInt(a.year, 10);
      const yearB = parseInt(b.year, 10);
  
      const hasYearA = !isNaN(yearA);
      const hasYearB = !isNaN(yearB);
  
      if (!hasYearA && !hasYearB) return 0;
      if (!hasYearA) return 1;
      if (!hasYearB) return -1;
  
      return yearB - yearA;
    });
  }, [filter, results]);

  async function handleAddClick(album) {
    setErrorId(null);

    if (isEditing) {
      onSelect(album);
      return;
    }

    setAddingIds((current) => new Set(current).add(album.musicbrainzId));

    try {
      await onAdd(album);
      setAddedIds((current) => new Set(current).add(album.musicbrainzId));
    } catch (error) {
      console.error("Unable to add album:", error);
      setErrorId(album.musicbrainzId);
    } finally {
      setAddingIds((current) => {
        const next = new Set(current);
        next.delete(album.musicbrainzId);
        return next;
      });
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
              const isAdding = addingIds.has(album.musicbrainzId);
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
                      ? "Added"
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