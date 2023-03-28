import React, { Fragment, useEffect, useState, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import axios from 'axios';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMoviesHandler = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get('https://react-http-f7e2d-default-rtdb.firebaseio.com/movies.json');
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
    }, []);

    useEffect(() => {
        fetchMoviesHandler();
    }, [fetchMoviesHandler]);

    function addMovieHandler(movie) {
        console.log(movie);
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
                <AddMovie onAddMovie={addMovieHandler} />
            </section>
            <section>
                <button onClick={fetchMoviesHandler}>Fetch Movies</button>
            </section>
            <section>{content}</section>
        </Fragment>
    );
}

export default App;
