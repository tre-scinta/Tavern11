import { useState, useEffect } from 'react';
import fetchJSON from '../utils/fetchJSON';


function useFetchAtInterval(url, interval, setState) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(`Failed to fetch from ${url}:`, error);
      }
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, interval); // Set up interval

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [url, interval]); // Dependencies
  return data;
}

export default useFetchAtInterval;