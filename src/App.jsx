import Search from './components/Search'
import { useState } from 'react'

const App = () => {
  const [searchTerm , setSearchTerm] = useState('');

  return (
    <main>
      <div className='pattern'/>

      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt='hero-banner'/>

          <h1>The <span className='text-gradient'>Movies</span> You Will Enjoy</h1>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

      </div>
    </main>
  )
}

export default App
