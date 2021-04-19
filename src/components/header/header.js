import React from "react";

function Header({ tab, tabToggle }) {
  return (
    <header className="header">
      <div className="toggle" onClick={tabToggle}>
        <button className={tab === "Search" ? "button-active" : ""}>
          Search
        </button>
        <button className={tab === "Rated" ? "button-active" : ""}>
          Rated
        </button>
      </div>
    </header>
  );
}

export default Header;
