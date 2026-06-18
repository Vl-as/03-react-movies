// import { useState } from 'react'
import { useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import './App.module.css';
import type { Movie } from '../../types/movie';
import fetchMovies from '../../services/movieService';
import toast, { Toaster } from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const openModale = (movie: Movie) => setSelectedMovie(movie);

  const closeModale = () => setSelectedMovie(null);

  const handleSearch = async (query: string) => {
    try {
      setMovies([]);
      setIsLoader(true);
      setIsError(false);
      const data = await fetchMovies(query);
      if (data.length === 0) {
        toast.error('No movies found for your request.', {
          style: {
            border: '1px solid #b62927',
            padding: '16px',
            color: '#b62927',
          },
          iconTheme: {
            primary: '#b62927',
            secondary: '#FFFAEE',
          },
        });
      }
      setMovies(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoader(false);
    }
  };
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={handleSearch}></SearchBar>
      {isLoader && <Loader></Loader>}
      {isError && <ErrorMessage></ErrorMessage>}
      {movies.length > 0 && (
        <MovieGrid onSelect={openModale} movies={movies}></MovieGrid>
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModale} />
      )}
    </>
  );
}

export default App;
