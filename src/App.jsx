import React, { Fragment, useState } from 'react';
import MoviesList from './components/MoviesList';
import axios from 'axios';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchMoviesHandler() {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get('https://swapi.dev/api/films/');
            const data = await response.data;

            const transformedMovies = data.results.map(movieData => {
                return {
                    id: movieData.episode_id,
                    title: movieData.title,
                    openingText: movieData.opening_crawl,
                    releaseDate: movieData.release_date
                };
            });

            setMovies(transformedMovies);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    }

    let content = <p>Found no movies.</p>;

    if (error) {
        content = <p>{error}</p>;
    }

    if (movies.length > 0) {
        content = <MoviesList movies={movies} />;
    }

    if (isLoading) {
        content = <p>Loading...</p>;
    }

    return (
        <Fragment>
            <section>
                <button onClick={fetchMoviesHandler}>Fetch Movies</button>
            </section>
            <section>{content}</section>
        </Fragment>
    );
}

export default App;
