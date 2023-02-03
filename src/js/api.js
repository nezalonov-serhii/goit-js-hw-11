import axios from 'axios';

const API_KEY = '33331302-a2f968128fc99efede8b05269';
const URL = 'https://pixabay.com/api/';

export default async function fetchPhotos(search, currentPage) {
  try {
    const response = await axios.get(
      `${URL}?key=${API_KEY}&q=${search}&image_type=photo&safesearch=true&orientation=horizontal&per_page=40&page=${currentPage}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
