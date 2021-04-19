import React from "react";

function SearchBar({ tab, searchHandler }) {
  if (tab !== "Search") {
    return null;
  }
  return (
    <input
      className="search"
      type="search"
      placeholder="Type to search..."
      onChange={searchHandler}
    />
  );
}

export default SearchBar;
