import React, { useEffect, useState } from 'react';
import Movie from '../movie';
const MOVIES_API = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=8cb439222da4a8901afb40ed93e0947f&page=1';

const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=8cb439222da4a8901afb40ed93e0947f&query=';


function App () {
    const [ movies, setMovies ] = useState([]);
    const [ searchTerm, setSearchTerm ] = useState('');

    const getMovies = async (API) => {
        const moviesResp = await fetch (API);
        const data = await moviesResp.json();
        setMovies(data.results);
    }
    useEffect(() => {
        getMovies(MOVIES_API);
    }, []);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if(searchTerm) {
            getMovies(SEARCH_API + searchTerm);
            setSearchTerm('')
        }
    }

    const handleOnChange = (e) => {
        setSearchTerm(e.target.value);
    }
    return (
        <>
            <header className='header'>
                <div className='toggle'>
                    <button className='button-active'>Search</button>
                    <button>Rated</button>
                </div>
                <form onSubmit={handleOnSubmit}>
                    <input 
                        className='search'
                        type='search'
                        placeholder='Type to search...'
                        value={searchTerm}
                        onChange={handleOnChange}/>
                </form>
            </header>
            <div className='movies-container'>
                {movies.length > 0 && movies.map(movie => 
                <Movie key={movie.id} {...movie}/>)}
            </div>
        </>
        
    )
}

export default App;