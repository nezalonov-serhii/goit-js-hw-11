import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import fetchPhotos from './js/api';

const ref = {
  form: document.getElementById('search-form'),
  inputSearch: document.getElementById('input-form'),
  btnSearch: document.getElementById('submit-form'),
  gallary: document.querySelector('.gallery'),
  btnLoadMore: document.getElementById('load-more-btn'),
};

let currentPage = 1;
let searchName = '';

let gallary = null;

ref.form.addEventListener('submit', onClickSearch);

function onClickSearch(e) {
  e.preventDefault();

  currentPage = 1;
  ref.btnLoadMore.classList.add('is-hiden');
  searchName = ref.inputSearch.value;

  fetchPhotos(searchName, currentPage).then(photos => {
    const totalPages = photos.totalHits / 40;

    if (!photos.hits[0]) {
      return Notiflix.Notify.failure(
        '"Sorry, there are no images matching your search query. Please try again."'
      );
    }

    Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
    const marckap = generateMarckap(photos.hits);

    ref.gallary.innerHTML = marckap;
    gallary = new SimpleLightbox('.gallery-item');

    if (totalPages < currentPage) {
      ref.btnLoadMore.classList.add('is-hiden');
    } else {
      ref.btnLoadMore.classList.remove('is-hiden');
    }
  });
}

function generateMarckap(photos) {
  return photos.reduce((acc, photo) => {
    return (
      acc +
      `
    <div class="photo-card">
    <a href="${photo.largeImageURL}" class="gallery-item">
        <img src="${photo.webformatURL}" alt="" loading="lazy" />
    </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${photo.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${photo.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${photo.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${photo.downloads}
    </p>
  </div>
</div>
        `
    );
  }, '');
}

ref.btnLoadMore.addEventListener('click', clickOnLoadMore);

function clickOnLoadMore(e) {
  currentPage += 1;

  fetchPhotos(searchName, currentPage).then(photos => {
    const marckap = generateMarckap(photos.hits);

    ref.gallary.insertAdjacentHTML('beforeend', marckap);

    gallary.refresh();
    const totalPages = photos.totalHits / 40;

    if (totalPages < currentPage) {
      ref.btnLoadMore.classList.add('is-hiden');

      return Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}
