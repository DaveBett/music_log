import EntryList from "../EntryList";

export default function PublicLogSection( {entries} ) {
  return (
    <div className="app">
      <div className="app-container">
        <EntryList entries={entries} editable={false} />
     </div>
    </div>
  );
}