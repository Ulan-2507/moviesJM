import React from "react";
import { v4 as uuidv4 } from "uuid";

function Genres(props) {
  const { genres, searchByGenre, genresByCodes } = props;

  const handleSearchByGenre = (e) => {
    searchByGenre(e.target.closest("li").value);
  };

  const genresList = genres.map((genreCode) => {
    return (
      <li key={uuidv4()} value={genreCode} className="movie__genre-item">
        <button>{genresByCodes.get(genreCode)}</button>
      </li>
    );
  });
  return (
    <ul className="movie__genre" onClick={handleSearchByGenre}>
      {genresList}
    </ul>
  );
}

export default Genres;
