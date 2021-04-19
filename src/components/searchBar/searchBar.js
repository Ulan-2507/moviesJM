import React, { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";

function SearchBar({ tab, searchHandler, value }) {
  const [searchTerm, setSearchTerm] = useState(value);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    searchHandler(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchHandler]);

  if (tab === "Search") {
    return (
      <input
        aria-label="Search"
        className="search"
        type="search"
        placeholder="Type to search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        autoFocus
      />
    );
  }
  return null;
}

export default SearchBar;
