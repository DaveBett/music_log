import { useState, useEffect } from "react"

const AddEntry = ({addEntry, updateEntry, editingEntry, setEditingEntry}) => {

  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(2026);

  useEffect(() => {
    if (editingEntry) {
        setArtist(editingEntry.artist);
        setTitle(editingEntry.title);
        setYear(editingEntry.year);
    } else {
        setArtist("");
        setTitle("");
        setYear(2026);
    }
}, [editingEntry]);

  const handleSubmit = () => {
    if (editingEntry) {
        updateEntry(editingEntry.id, artist, title, year);
    } else {
        addEntry(artist, title, year);
    }
    setArtist("");
    setTitle("");
    setYear(2026);
    setEditingEntry(null);
  }
  const cancelEdit = () => {
    setArtist("");
    setTitle("");
    setYear(2026);
    setEditingEntry(null);
  };

  return (
    <div className="add-entry">
      <input 
        value={artist}
        id="artist" 
        className="add-input" 
        type="text" 
        placeholder="Artist" 
        onChange={(e) => setArtist(e.target.value)}
        />
      <input 
        value={title}
        id="title" 
        className="add-input" 
        type="text" 
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
        />
      <input 
        value={year}
        id="year" 
        className="add-input" 
        type="number" 
        placeholder="Year" 
        onChange={(e) => setYear(e.target.value)}
        />
      <div className="form-buttons">
        <button className="add-button" onClick={handleSubmit}>
          {editingEntry ? "Update" : "Add Album"}
        </button>
        {editingEntry && (<button className="cancel-button" onClick={cancelEdit}>Cancel</button>)}
      </div>
    </div>
  )
}

export default AddEntry;