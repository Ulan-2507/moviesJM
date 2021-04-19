import React from 'react';
import format from 'date-fns/format'
import './movie.css';
import defaultPoster from './default-poster.jpg';

const IMG_API = 'https://image.tmdb.org/t/p/w1280';

// const GENRE_API ='https://api.themoviedb.org/3/genre/movie/list?api_key=8cb439222da4a8901afb40ed93e0947f';
const textLimit = (text) => {
     const words = text.split(' ');
     let charCount = 3;
     if(text.length >= 150) {
        return words.map(word => {
            charCount += word.length + 1;
            if(charCount <= 150) {
                return word;
            } else {
                return ''
            }
         }).join(' ') + ' ...';
     }
     return text;
}

const Movie = ({ title, poster_path, overview, vote_average, release_date }) => {
    console.log(release_date)
    const text = textLimit(overview) ;
    const poster = poster_path ? IMG_API + poster_path : defaultPoster;
    const release = release_date ? format(new Date(release_date),'MMMM d, yyyy') : 'no release date';
    return (
        <div className='movie'>
             <div className='movie__poster'>
                <img src={ poster } alt={ title }/>
            </div>
            <div className='movie__info'>
                <div className='movie__header'>
                    <h5>{ title }</h5>
                    <span>{ vote_average }</span>
                </div>
                <div className='movie__release-date'>{ release }</div>
                <div className='movie__genre'>
                    <a href='#'>Action</a>
                    <a href='#'>Drama</a>
                </div>
                <div className='movie__overview'>{ text }</div>
            </div>
        </div>
    );
}

export default Movie;