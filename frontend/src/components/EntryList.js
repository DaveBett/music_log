import Entry from "./Entry";

const EntryList = ({
  entries,
  onEdit,
  deleteEntry,
  editingEntry,
  confirmDeleteId,
  setConfirmDeleteId,
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
      <div className="entry-legend">
        <h3 className="small">#</h3>
        <h3 className="medium">Listened</h3>
        <h3 className="big">Artist</h3>
        <h3 className="big">Album</h3>
        <h3 className="medium">Year</h3>
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
          editable={true}
        />
      ))}

    </div>
  );
};

export default EntryList;