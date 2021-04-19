import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Spin } from 'antd';
import { Alert } from 'antd';
import Movie from '../movie';

const MOVIES_API = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=8cb439222da4a8901afb40ed93e0947f&page=1';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=8cb439222da4a8901afb40ed93e0947f&query=';


function App () {
    const [ movies, setMovies ] = useState([]);
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(false);

    const getMovies = (API) => {
        fetch(API)
            .then(response =>{ 
                if(response.status === 200) { 
                    return response.json()
                } else {
                    throw new Error()
                }
            })
            .then(data => {
                setMovies(data.results)
                setLoading(false)
            })
            .catch(err => onError(err));
    }

    const onError = () => {
        setLoading(false);
        setError(true);
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

    const errorMessage = error ? <Alert
                            message="ошибка"
                            description="попробуйте еще раз"
                            type="error"
                        /> : null;
    const antIcon = loading ? <Spin size='large'/> : null;
    const moviesData = movies.length > 0 ? movies.map(movie => <Movie key={movie.id} {...movie}/>) : null;
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
            <section className='movies-container'>
                {errorMessage}
                {antIcon}
                {moviesData}
            </section>
        </>
        
    )
}

export default App;