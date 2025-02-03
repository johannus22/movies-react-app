import { getTrendingMovies, updateSearchCount } from './appwrite.ts';
import MovieCard from './components/MovieCard';
import Search from './components/Search'
import Spinner from './components/Spinner';
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm , setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  

  //functions
  //prevents too many API calls
  useDebounce(() => { setDebouncedSearchTerm(searchTerm) }, 1000, [searchTerm]);

  const fetchMovies = async (query = '') => {

    setIsLoading(true);
    setErrorMessage('');
    try{
      const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` 
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      
      if(!response.ok){
        throw new Error('An error occurred while fetching data.');
      }
      const data = await response.json();
      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'An error occurred while fetching data.');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
     
      if(query && data.results.length > 0){
        updateSearchCount(query, data.results[0]);
      }

    }catch(error){
      console.error(`Error: ${error}`);
      setErrorMessage('An error occurred while fetching data. Please try again later.');
    }finally{
      setIsLoading(false);
  }
}

  const loadTrendingMovies = async () => {
      try {
        const movies = await getTrendingMovies();
        setTrendingMovies(movies);
      } catch (error) {
        console.error(`Error: ${error}`);
      }
  }

  //useEffects
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);


  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <h1 className='text-gradient'>MovieRadar</h1>
          <img src="./hero.png" alt='hero-banner'/>

          <h1>The <span className='text-gradient'>Movies</span> You Will Enjoy</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2 className='mt-5 text-center'>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}


        <section className='all-movies'>
          <h2 className='mt-5 text-center'>All Movies</h2>
          { isLoading 
          ? <Spinner />
          : errorMessage 
          ? (<p className='text-red-500'>{errorMessage}</p>)
          : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}

          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
        </section>

      </div>
    </main>
  )
}

export default App
