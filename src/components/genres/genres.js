import React from "react";
import { v4 as uuidv4 } from "uuid";

function Genres(props) {
  const { genres, searchByGenre, genresByCodes } = props;
  const handleSearchByGenre = (e) => {
    searchByGenre(e.target.value);
  };

  const genresList = genres.map((genreCode) => {
    return (
      <li key={uuidv4()} className="movie__genre-item">
        <button value={genreCode}>{genresByCodes.get(genreCode)}</button>
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
