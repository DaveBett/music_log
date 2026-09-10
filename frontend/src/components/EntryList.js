import { useEffect, useMemo, useState } from "react";
import Entry from "./Entry";

const PAGE_SIZE = 10;
const SIBLING_COUNT = 2;

const EntryList = ({
  entries,
  onEdit,
  deleteEntry,
  editingEntry,
  confirmDeleteId,
  setConfirmDeleteId,
  editable = false
}) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Mappa id -> numero originale, calcolato UNA volta sulla collezione
  // completa, così il numero resta stabile indipendentemente dal filtro.
  const originalIndexById = useMemo(() => {
    const map = new Map();
    entries.forEach((entry, i) => {
      map.set(entry.id, entries.length - i);
    });
    return map;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return entries;

    return entries.filter((entry) => {
      const haystack = `${entry.artist} ${entry.title}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [entries, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  function getFormattedDate(date) {
    if (!date) return "";
    return `${date.slice(8, 10)}/${date.slice(5, 7)}`;
  }

  function getPageNumbers() {
    const pages = [];
    const start = Math.max(2, page - SIBLING_COUNT);
    const end = Math.min(totalPages - 1, page + SIBLING_COUNT);

    pages.push(1);

    if (start > 2) {
      pages.push("ellipsis-start");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("ellipsis-end");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  if (entries.length === 0) {
    return (
      <div className="empty-entries">
        <p>
          This music collection is empty.
        </p>
      </div>
    );
  }

  const startIndex = (page - 1) * PAGE_SIZE;
  const pageEntries = filteredEntries.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="entry-list">
      {editable && (
        <div className="musicbrainz-searching">
            Click on any album name to leave a review.
        </div>
      )}

      {filteredEntries.length === 0 ? (
        <div className="empty-entries">
          <p>No albums match your search.</p>
        </div>
      ) : (
        <>
          <div className="entry-legend">
            <h3 className="entry-number">#</h3>
            <h3 className="entry-date">Added</h3>
            <h3 className="entry-artist">Artist</h3>
            <h3 className="entry-album">Album</h3>
            <h3 className="entry-year">Year</h3>
            <div className="medium"></div>
          </div>

          {pageEntries.map((entry) => (
            <Entry
              key={entry.id}
              id={entry.id}
              index={originalIndexById.get(entry.id)}
              added={getFormattedDate(entry.created_at)}
              artist={entry.artist}
              title={entry.title}
              year={entry.year}
              entry={entry}
              onEdit={onEdit}
              deleteEntry={deleteEntry}
              editing={
                editingEntry?.id === entry.id
              }
              confirmDelete={
                confirmDeleteId === entry.id
              }
              setConfirmDeleteId={
                setConfirmDeleteId
              }
              isNew={false}
              editable={editable}
            />
          ))}
        </>
      )}

      <div className="entry-list-footer">
        <input
          className="auth-input entry-search-input"
          type="text"
          placeholder="Search for albums or artists in this log..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />

        <div className="entry-pagination">
          <button
            className="entry-pagination-button"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            First
          </button>

          <button
            className="entry-pagination-button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>

          {getPageNumbers().map((entryPage, i) =>
            typeof entryPage === "number" ? (
              <button
                key={entryPage}
                className={`entry-pagination-page ${
                  page === entryPage ? "active" : ""
                }`}
                onClick={() => setPage(entryPage)}
              >
                {entryPage}
              </button>
            ) : (
              <span key={`${entryPage}-${i}`} className="entry-pagination-ellipsis">
                …
              </span>
            )
          )}

          <button
            className="entry-pagination-button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>

          <button
            className="entry-pagination-button"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            Last
          </button>
        </div>
      </div>

    </div>
  );
};

export default EntryList;