import React, { useState, useEffect, useRef } from "react";

function Header({ tabToggle }) {
  const ref = useRef(null);
  const [tab, setTab] = useState({});
  const activeClass = "button-active";

  const onClickHandler = (e) => {
    tab.className = "";
    e.target.className = activeClass;
    setTab(e.target);

    tabToggle(e.target.textContent);
  };
  useEffect(() => {
    setTab(ref.current);
  }, []);

  return (
    <header className="header">
      <div className="toggle" onClick={onClickHandler}>
        <button ref={ref} className={activeClass}>
          Search
        </button>
        <button>Rated</button>
      </div>
    </header>
  );
}

export default Header;
