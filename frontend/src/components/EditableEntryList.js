import AddEntry from "./AddEntry";
import EntryList from "./EntryList";

export default function EditableEntryList({
  entries,

  addEntry,
  updateEntry,

  deleteEntry,

  editingEntry,
  setEditingEntry,

  onEdit,

  confirmDeleteId,
  setConfirmDeleteId,

  newEntryId,

  musicbrainzUrl
}) {
  return (
    <>
      <AddEntry
        addEntry={addEntry}
        updateEntry={updateEntry}
        editingEntry={editingEntry}
        setEditingEntry={setEditingEntry}
        musicbrainzUrl={entries.musicbrainz_url}
      />

      <EntryList
        entries={entries}
        deleteEntry={deleteEntry}
        editingEntry={editingEntry}
        onEdit={onEdit}
        confirmDeleteId={confirmDeleteId}
        setConfirmDeleteId={setConfirmDeleteId}
        newEntryId={newEntryId}
        editable={true}
      />
    </>
  );
}