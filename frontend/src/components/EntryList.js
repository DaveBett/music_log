import Entry from "./Entry" 

const EntryList = ({
  entries, 
  deleteEntry, 
  editingEntry, 
  onEdit, 
  confirmDeleteId, 
  setConfirmDeleteId,
  newEntryId
}) => {

  function getFormattedDate(date) {
    if (date === undefined) {
      return
    }
    const mm = date.slice(5, 7);
    const dd = date.slice(8, 10);
    
    return (`${dd}/${mm}`);
  }
  var index = -1;

  return (
    <div className="entry-list">
      <div className="entry-legend">
        <h3 className="small">#</h3>
        <h3 className="medium">Listened</h3>
        <h3 className="big">Artist</h3>
        <h3 className="big">Album</h3>
        <h3 className="medium">Year</h3>
        <div className="small"/>
        <div className="small"/>
      </div>
      {
        entries.map((entry) => {
          index += 1;
          return (
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
              editing={editingEntry?.id === entry.id}
              deleteEntry={deleteEntry}       
              confirmDelete={confirmDeleteId === entry.id}
              setConfirmDeleteId={setConfirmDeleteId}
              isNew={newEntryId === entry.id}
            />
          )
        })
      }
    </div>
  )
}

export default EntryList