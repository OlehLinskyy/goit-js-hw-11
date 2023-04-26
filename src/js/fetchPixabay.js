const axios = require('axios').default;
const API_KEY = '35665373-98cf5b8f6eeff8ca0cc84fee2';
const BASE_URL = 'https://pixabay.com/api/';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  fetchHits = async () => {
    return await axios
      .get(
        `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
      )
      .then(({ data }) => {
        this.incrementPage();
        return data;
      })
      .catch(error => console.log(error));
  };

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
