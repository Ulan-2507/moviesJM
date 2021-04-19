import React from "react";
import format from "date-fns/format";
import { Rate } from 'antd';
import "./movie-card.css";
import defaultPoster from "./default-poster.jpg";

const IMG_API = "https://image.tmdb.org/t/p/w200";

// const GENRE_API ='https://api.themoviedb.org/3/genre/movie/list?api_key=8cb439222da4a8901afb40ed93e0947f';
const textLimit = (text, count) => {
  const words = text.split(" ");
  let charCount = 3;
  if (text.length >= count) {
    return (
      words
        .map((word) => {
          charCount += word.length + 1;
          if (charCount <= count) {
            return word;
          } else {
            return "";
          }
        })
        .join(" ") + " ..."
    );
  }
  return text;
};

function getClassByRate(vote) {
  if (vote >= 7) {
      return "green";
  } else if (vote >= 5) {
      return "yellow";
  } else if (vote >= 3) {
      return "orenge";
  } else {
    return "red";
  }
}

const MovieCard = ({
  title,
  poster_path,
  overview,
  vote_average,
  release_date,
}) => {
  const text = textLimit(overview, 120);
  const movieTitle = textLimit(title, 30);
  const poster = poster_path ? IMG_API + poster_path : defaultPoster;
  const release = release_date
    ? format(new Date(release_date), "MMMM d, yyyy")
    : "no release date";
  return (
    <div className="movie">
      <div className="movie__poster">
        <img src={poster} alt={title} />
      </div>
      <div className="movie__info">
        <div className="movie__header">
          <h5>{movieTitle}</h5>
          <span className={getClassByRate(vote_average)}>
            {vote_average}
            </span>
        </div>
        <div className="movie__release-date">{release}</div>
        <div className="movie__genre">
          <a href="#">Action</a>
          <a href="#">Drama</a>
        </div>
        <div className="movie__overview">{text}</div>
        <Rate 
          className="rate" 
          allowHalf={true}
          defaultValue={0} 
          count={10}
          onChange={(value) => console.log(value)}/>
      </div>
    </div>
  );
};

export default MovieCard;
