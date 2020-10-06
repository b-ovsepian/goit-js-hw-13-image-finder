const fetchImages = (query, page, API_key) => {
  const url = `https://cors-anywhere.herokuapp.com/https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12&key=${API_key}`;
  return fetch(url)
    .then(data => data.json())
    .then(data => data.hits);
};

export default fetchImages;
