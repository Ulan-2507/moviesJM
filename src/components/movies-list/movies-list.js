import React from "react";
import MovieCard from "../movie-card";
import useRatedLocalStorage from "../hooks/useRatedLocalStorage";

import { TmdbapiServiceConsumer } from "../tmdbapi-sevice-context";

function MoviesList({ movies, tab, update }) {
  const [ratedMovies] = useRatedLocalStorage();
  if (!movies) {
    return;
  }
  const items = movies.map((movie) => {
    const ratingValue = ratedMovies.length !== 0 ? ratedMovies[movie.id] : 0;
    return (
      <TmdbapiServiceConsumer key={movie.id}>
        {({ sessionId }) => {
          return (
            <MovieCard
              movie={movie}
              tab={tab}
              ratingValue={ratingValue}
              sessionId={sessionId}
              update={update}
            />
          );
        }}
      </TmdbapiServiceConsumer>
    );
  });
  return <section className="movies-container">{items}</section>;
}

export default MoviesList;
