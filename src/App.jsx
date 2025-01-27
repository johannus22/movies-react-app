import MovieCard from './components/MovieCard';
import Search from './components/Search'
import Spinner from './components/Spinner';
import { useEffect, useState } from 'react'

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm , setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {

    setIsLoading(true);
    setErrorMessage('');
    try{
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      

      if(!response.ok){
        throw new Error('An error occurred while fetching data.');
      }
      const data = await response.json();
      console.log(data);

      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'An error occurred while fetching data.');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

    }catch(error){
      console.error(`Error: ${error}`);
      setErrorMessage('An error occurred while fetching data. Please try again later.');
    }finally{
      setIsLoading(false);
  }
}
  useEffect(() => {
    fetchMovies();
  }, []);

 
  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt='hero-banner'/>

          <h1>The <span className='text-gradient'>Movies</span> You Will Enjoy</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        <section className='all-movies'>
          <h2 className='mt-5 text-center'>All Movies</h2>
          {isLoading ? <Spinner />
          : errorMessage ? 
          (<p className='text-red-500'>{errorMessage}</p>)
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
