import React from "react";
import format from "date-fns/format";
import { Rate } from "antd";

import useRatedLocalStorage from "../hooks/useRatedLocalStorage";
import Genres from "../genres";
import "./movie-card.css";
import defaultPoster from "./default-poster.jpg";
import TMDBService from "../../services/tmdbapi-service";
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
          }
          return "";
        })
        .join(" ") + " ..."
    );
  }
  return text;
};

function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  }
  if (vote >= 5) {
    return "yellow";
  }
  if (vote >= 3) {
    return "orenge";
  }
  return "red";
}

const MovieCard = (props) => {
  const [, setRatedMovies, deleteRatedMovies] = useRatedLocalStorage();
  const { getPosterImage, setMovieRating, deleteRatedMovie } = TMDBService;

  const { movie, tab, ratingValue, sessionId, update } = props;
  const {
    title,
    poster_path,
    overview,
    vote_average,
    release_date,
    id,
    genre_ids,
  } = movie;

  const onChangeHandler = (value) => {
    if (tab === "Rated") {
      deleteRatedMovies(id);
      deleteRatedMovie(id, sessionId);
      update(id);
      return;
    }
    setRatedMovies(id, value);
    setMovieRating(id, value, sessionId);
  };

  const textLength = () => {
    if (genre_ids.length <= 3) return 120;
    return 80;
  };
  const titleLength = () => {
    if (window.innerWidth <= 500) return 20;
    return 30;
  };
  const posterSize = () => {
    if (window.innerWidth <= 500) return 92;
    return 200;
  };
  const getPoster = () => {
    if (poster_path) return getPosterImage(poster_path, posterSize());
    return defaultPoster;
  };
  const getReleaseDate = () => {
    if (release_date) return format(new Date(release_date), "MMMM d, yyyy");
    return "no release date";
  };

  const text = textLimit(overview, textLength());
  const movieTitle = textLimit(title, titleLength());
  const poster = getPoster();
  const release = getReleaseDate();
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
          defaultValue={ratingValue}
          count={10}
          onChange={onChangeHandler}
        />
      </div>
    </article>
  );
};

export default MovieCard;
