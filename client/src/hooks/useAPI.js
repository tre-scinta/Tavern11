import React, { useState, useEffect } from 'react';
import fetchJSON from '../utils/fetchJSON';


const useAPI = (url, options, dependencies = []) => {
    const [data, setData] = useState(null);
    useEffect(() => {
      fetchJSON(url, options).then(setData).catch(console.error);
    }, dependencies);
    return [data, setData];
  };
export default useAPI;