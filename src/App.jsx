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

        // GET request to get the data from the database
        try {
            const response = await axios.get('https://react-http-f7e2d-default-rtdb.firebaseio.com/movies.json');
            const data = await response.data;
            console.log(data);

            const loadedMovies = [];

            for (const key in data) {
                loadedMovies.push({
                    id: key,
                    title: data[key].title,
                    openingText: data[key].openingText,
                    releaseDate: data[key].releaseDate
                });
            }

            setMovies(loadedMovies);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchMoviesHandler();
    }, [fetchMoviesHandler]);

    // POST request to add a new movie to the 'firebase' database
    async function addMovieHandler(movie) {
        const response = fetch('https://react-http-f7e2d-default-rtdb.firebaseio.com/movies.json', {
            method: 'POST',
            body: JSON.stringify(movie),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
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
