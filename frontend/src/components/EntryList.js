import Entry from "./Entry";

const EntryList = ({
  entries,
  onEdit,
  deleteEntry,
  editingEntry,
  confirmDeleteId,
  setConfirmDeleteId,
  editable = false
}) => {

  function getFormattedDate(date) {
    if (!date) return "";
    return `${date.slice(8, 10)}/${date.slice(5, 7)}`;
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

  return (
    <div className="entry-list">
      {editable && (
        <div className="musicbrainz-searching">
            Click on any album name to leave a review.
        </div>
      )}
      <div className="entry-container">
        <h3 className="entry-number">#</h3>
        <h3 className="entry-date">Listened</h3>
        <h3 className="entry-artist">Artist</h3>
        <h3 className="entry-album">Album</h3>
        <h3 className="entry-year">Year</h3>
        <div className="medium"></div>
      </div>

      {entries.map((entry, index) => (
        <Entry
          key={entry.id}
          id={entry.id}
          index={entries.length - index}
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

    </div>
  );
};

export default EntryList;