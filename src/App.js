import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const initialList = ['A', 'B', 'C', 'D', 'E'];
  const [search, setSearch] = useState('');
  const [list, setList] = useState(initialList);
  const [fetchedAlbums, setFetchedAlbums] = useState([]);
  const [debounced, setDebounced] = useState(search);

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebounced(search);
    }, 500);
    return () => {
      clearTimeout(timerId);
    };
  }, [search]);

  useEffect(() => {
    if (debounced) {
      fetchData();
    } else {
      setFetchedAlbums([]);
      setList(initialList);
    }
  }, [debounced]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/search?term=${search}`); //added proxy in package.json
      let albums = response.data.results.map((result) => result.collectionName);
      albums = [...new Set(albums)].sort().slice(0, 5);
      setFetchedAlbums(albums);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setList((prevList) => {
        if (fetchedAlbums.length) {
          let newList = [...prevList.slice(1), ...fetchedAlbums].slice(-5);
          setFetchedAlbums([]);
          return newList;
        } else {
          return [...prevList.slice(1), prevList[0]];
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [list, fetchedAlbums]);

  return (
    <div>
    <div className='outlineItem'>
      <input className='searchItem' type="text"  value={search} onChange={handleChange} placeholder="Search here..." />
   
        {list.map((item, index) => (
          <div className="listItem" key={index}>{item}</div>
        ))}
    </div>
  
    </div>
  );
}

export default App;