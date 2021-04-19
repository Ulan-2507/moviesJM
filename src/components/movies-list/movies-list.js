import React from "react";
import MovieCard from "../movie-card";

import { TmdbapiServiceConsumer } from "../tmdbapi-sevice-context";

function MoviesList({ movies }) {
  if (!movies) {
    return null;
  }
  const items = movies.map((movie) => {
    const ratingValue = localStorage.getItem("ratedMovies")
      ? JSON.parse(localStorage.getItem("ratedMovies"))[`${movie.id}`]
      : 0;
    return (
      <TmdbapiServiceConsumer key={movie.id}>
        {({ tmdbService, sessionId }) => {
          return (
            <MovieCard
              movie={movie}
              ratingValue={ratingValue}
              sessionId={sessionId}
              tmdbService={tmdbService}
            />
          );
        }}
      </TmdbapiServiceConsumer>
    );
  });
  return <section className="movies-container">{items}</section>;
}

export default MoviesList;
