import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { search } from "../../api/endpoints";

import SearchDropdown from "./SearchDropDown";

export default function SearchBar() {
  const { user: currentUser } = useAuth();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);

  const timeout = useRef(null);

  useEffect(() => {
    if (query.trim() === "") {
      setResults(null);
      setOpen(false);
      return;
    }

    clearTimeout(timeout.current);

    timeout.current = setTimeout(async () => {
      try {
        const data = await search(query);

        setResults(data);
        setOpen(true);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timeout.current);
  }, [query]);

  return (
    <div className="search-container">
      <input
        className="search-input"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {open && results && (
        <SearchDropdown
          results={results}
          currentUser={currentUser}
          close={() => setOpen(false)}
        />
      )}
    </div>
  );
}