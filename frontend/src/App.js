import './App.css';
import EntryList from "./components/EntryList";
import AddEntry from './components/AddEntry';
import TopButton from './components/TopButton';
import Footer from "./components/Footer"
import { useState, useEffect } from 'react';
import { get_entries, create_entry, delete_entry, update_entry } from "./api/endpoints";

function App() {

  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [newEntryId, setNewEntryId] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      const entries = await get_entries();
      setEntries(entries);
    }
    fetchEntries();
  }, [])

  const addEntry = async (artist, title, year) => {
    const entry = await create_entry(artist, title, year);
    setEntries(prev => [entry, ...prev])

    setNewEntryId(entry.id);
  }

  const deleteEntry = async (id) => {
    await delete_entry(id);
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  const updateEntry = async (id, artist, title, year) => {
    const updated = await update_entry(id, artist, title, year);

    setEntries(entries =>
      entries.map(entry =>
        entry.id === id ? updated : entry
      )
    );
    setEditingEntry(null);
  }

  const handleEdit = (entry) => {
    setEditingEntry(entry);
  
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="App">
      <div className='app-container'>
        <h1 className='title'>Music Log</h1>
        <AddEntry 
          addEntry={addEntry} 
          updateEntry={updateEntry} 
          editingEntry={editingEntry} 
          setEditingEntry={setEditingEntry}
        />
        <EntryList 
          entries={entries} 
          editingEntry={editingEntry} 
          deleteEntry={deleteEntry}
          onEdit={handleEdit}
          confirmDeleteId={confirmDeleteId}
          setConfirmDeleteId={setConfirmDeleteId}
          newEntryId={newEntryId}
        />
       <TopButton />
        <Footer />
      </div>
    </div>
  );
}

export default App;
