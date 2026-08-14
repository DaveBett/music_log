import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import EditableEntryList from "./EditableEntryList";
import TopButton from "./TopButton";

import {
  get_entries,
  create_entry,
  delete_entry,
  update_entry
} from "../api/endpoints";

export default function MusicLog() {
  const { user } = useAuth();
  const addRef = useRef();

  const [entries, setEntries] = useState([]);

  const [editingEntry, setEditingEntry] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [newEntryId, setNewEntryId] = useState(null);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    const data = await get_entries();
    setEntries(data);
  }

  const addEntry = async (
    artist,
    title,
    year,
    musicbrainzId,
    musicbrainzUrl
  ) => {
    const entry = await create_entry(
      artist,
      title,
      year,
      musicbrainzId,
      musicbrainzUrl
    );
  
    setEntries(prev => [entry, ...prev]);
  
    setNewEntryId(entry.id);
  };

  async function removeEntry(id) {
    await delete_entry(id);

    setEntries(prev =>
      prev.filter(entry => entry.id !== id)
    );
    setEditingEntry(null)
  }

  async function saveEntry(
    id,
    artist,
    title,
    year,
    musicbrainzId,
    musicbrainzUrl
  ) {
    const updated = await update_entry(
      id,
      artist,
      title,
      year,
      musicbrainzId,
      musicbrainzUrl
    );
  
    setEntries(prev =>
      prev.map(entry =>
        entry.id === id ? updated : entry
      )
    );
  
    setEditingEntry(null);
  }

  function handleEdit(entry) {
    setEditingEntry(entry);

    addRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }

  return (
    <div className="app">
      <div className="app-container">

        <h1 className="title">
          {user?.username}'s Music Log
        </h1>

        <div ref={addRef}></div>
        <EditableEntryList
          entries={entries}
          addEntry={addEntry}
          updateEntry={saveEntry}
          deleteEntry={removeEntry}
          editingEntry={editingEntry}
          setEditingEntry={setEditingEntry}
          onEdit={handleEdit}
          confirmDeleteId={confirmDeleteId}
          setConfirmDeleteId={setConfirmDeleteId}
          newEntryId={newEntryId}
        />
        <TopButton />
      </div>
    </div>
  );
}