import Notiflix from 'notiflix';
// import  LoadMoreBtn  from './js/components/load-more-btn';
import PixabayApiService from './js/fetchPixabay';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const searchFormEl = document.querySelector('.search-form');
let count = 0;
let totalCount = 0;

// const loadMoreBtn = new LoadMoreBtn({
//     selector: '.load-more',
//     hidden: true,
// });
const pixabayApiService = new PixabayApiService();

searchFormEl.addEventListener('submit', onSearch);
// loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(evt) {
  count = 0;
  totalCount = 0;
  evt.preventDefault();
  pixabayApiService.query = evt.currentTarget.elements.searchQuery.value;

  if (pixabayApiService.query.trim() === '') {
    return;
  }
  // loadMoreBtn.show();
  pixabayApiService.resetPage();
  pixabayApiService.fetchHits().then(hits => {
    totalCount = hits.totalHits;
    clearContainer();
    appendArticlesMarkup(hits);
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(`Hooray! We found ${hits.totalHits} images.`);
      count += hits.hits.length;
    };
  });
}

// function onLoadMore() {
//     pixabayApiService.fetchHits().then(hits => {
//         appendArticlesMarkup(hits)
//         count += hits.hits.length
//         if(hits.totalHits === count) {
//             Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`)
//         }
//         const { height: cardHeight } = document
//             .querySelector(".gallery")
//             .firstElementChild.getBoundingClientRect();
//         console.log(cardHeight)
//         window.scrollBy({
//             top: cardHeight * 2,
//             behavior: "smooth",
//         });
//     })
// }

function appendArticlesMarkup(hits) {
  const markup = hits.hits.map(dataItem => buildCountries(dataItem)).join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearContainer() {
  galleryEl.innerHTML = '';
};

function buildCountries({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
        <a class="gallery__link link" href="${largeImageURL}">
            <div class="photo-card">
                <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes:</b>
                        <span>${likes}</span>
                    </p>
                    <p class="info-item">
                        <b>Views:</b>
                        <span>${views}</span>
                    </p>
                    <p class="info-item">
                        <b>Comments:</b>
                        <span>${comments}</span>
                    </p>
                    <p class="info-item">
                        <b>Downloads:</b>
                        <span>${downloads}</span>
                    </p>
                </div>
            </div>
        </a> 
    `;
};

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    if (count != totalCount) {
      pixabayApiService.fetchHits().then(hits => {
        appendArticlesMarkup(hits);
        count += hits.hits.length;
        if (hits.totalHits === count) {
          Notiflix.Notify.info(
            `We're sorry, but you've reached the end of search results.`
          );
        }
        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();
        console.log(cardHeight);
        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      });
    }
  }
});
