import React from "react";
import format from "date-fns/format";
import { Rate } from "antd";

import Genres from "../genres";
import "./movie-card.css";
import defaultPoster from "./default-poster.jpg";

import { TmdbapiServiceConsumer } from "../tmdbapi-sevice-context";

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

const MovieCard = (props) => {
  const { movie, ratingValue, sessionId, tmdbService } = props;
  const { getPosterImage, setMovieRating } = tmdbService;
  const {
    title,
    poster_path,
    overview,
    vote_average,
    release_date,
    id,
    genre_ids,
  } = movie;

  const textLingth = genre_ids.length <= 3 ? 120 : 80;
  const text = textLimit(overview, textLingth);
  const movieTitle = textLimit(title, 30);

  const poster = poster_path ? getPosterImage(poster_path) : defaultPoster;
  const release = release_date
    ? format(new Date(release_date), "MMMM d, yyyy")
    : "no release date";

  return (
    <article className="movie">
      <div className="movie__poster">
        <img src={poster} alt={title} />
      </div>
      <div className="movie__info">
        <div className="movie__header">
          <h5>{movieTitle}</h5>
          <span className={getClassByRate(vote_average)}>{vote_average}</span>
        </div>
        <div className="movie__release-date">{release}</div>
        <TmdbapiServiceConsumer>
          {({ searchByGenre, genresByCodes }) => (
            <Genres
              genres={genre_ids}
              searchByGenre={searchByGenre}
              genresByCodes={genresByCodes}
            />
          )}
        </TmdbapiServiceConsumer>

        <div className="movie__overview">{text}</div>
        <Rate
          className="rating"
          allowHalf={true}
          defaultValue={props.ratingValue ? ratingValue : 0}
          count={10}
          onChange={(value) => setMovieRating(id, value, sessionId)}
        />
      </div>
    </article>
  );
};

export default MovieCard;
