import React from 'react';
import MovieCard from '../movie-card';

function MoviesList({movies}) {
    if(!movies) {
        return null
    }
    const items = movies.map(movie => {
        return (
            <MovieCard key={movie.id} {...movie}/>
        );
    });
    return (
        <section className="movies-container">
            {items}
        </section>
    );
}

export default MoviesList;