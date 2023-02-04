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

async function onClickSearch(e) {
  e.preventDefault();

  currentPage = 1;
  clearMarkap(ref.gallary);
  ref.btnLoadMore.classList.add('is-hiden');
  searchName = ref.inputSearch.value;

  try {
    const data = await fetchPhotos(searchName, currentPage);
    const totalPages = data.totalHits / 40;

    if (data.hits.length === 0) {
      return Notiflix.Notify.failure(
        '"Sorry, there are no images matching your search query. Please try again."'
      );
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

    ref.gallary.innerHTML = generateMarckap(data.hits);

    gallary = new SimpleLightbox('.gallery-item');

    if (totalPages > currentPage) {
      ref.btnLoadMore.classList.remove('is-hiden');
    }
  } catch (error) {
    console.log(error);
  }

  ref.form.reset();
}

function generateMarckap(cards) {
  return cards.reduce((acc, card) => {
    return (
      acc +
      `
    <div class="photo-card">
    <a href="${card.largeImageURL}" class="gallery-item">
        <img src="${card.webformatURL}" alt="" loading="lazy" />
    </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${card.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${card.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${card.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${card.downloads}
    </p>
  </div>
</div>
        `
    );
  }, '');
}

ref.btnLoadMore.addEventListener('click', clickOnLoadMore);

async function clickOnLoadMore() {
  try {
    currentPage += 1;
    const data = await fetchPhotos(searchName, currentPage);

    ref.gallary.insertAdjacentHTML('beforeend', generateMarckap(data.hits));

    gallary.refresh();
    const totalPages = data.totalHits / 40;

    if (totalPages < currentPage) {
      ref.btnLoadMore.classList.add('is-hiden');

      return Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function clearMarkap(elem) {
  elem.innerHTML = '';
}
