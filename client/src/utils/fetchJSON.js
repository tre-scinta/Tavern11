const fetchJSON = (url, options) => fetch(url, options)
  .then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
// Validate content-type is JSON before parsing
    const contentType = res.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }
    throw new Error('Response not JSON');
  });

export default fetchJSON;