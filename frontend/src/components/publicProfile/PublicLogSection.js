import EntryList from "../EntryList";

export default function PublicLogSection( {entries} ) {
  return (
    <EntryList
      entries={entries}
      editable={false}
    />
  );
}