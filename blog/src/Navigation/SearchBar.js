import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import "./SearchBar.css"

const SearchBar = () => {
  return (
      <form>
        <div className='search-bar'>  
            <input type="text" name="name" className='input-search'/>
            <button type="submit" className='submit-button'>
                <SearchIcon />
            </button>
          </div>
      </form>
  )
}

export default SearchBar
