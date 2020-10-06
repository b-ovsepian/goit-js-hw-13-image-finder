import 'bootstrap/dist/css/bootstrap.min.css';
import 'basiclightbox/src/styles/main.scss';
import './styles.css';
import refs from './js/refs.js';
import fetchImages from './js/apiService.js';
import addToMarkup from './js/addToMarkup.js';
import 'bootstrap';
import 'infinite-scroll';
import * as basicLightbox from 'basiclightbox';

const API_key = '18582264-4fafc4bd5c65c2ee349044428';
let page = 1;
let inputValue;
let lightBox;
let currentIndex = 0;

refs.form.addEventListener('submit', event => {
  event.preventDefault();
  page = 1;
  refs.galleryList.innerHTML = '';
  const input = event.target.elements[0];
  inputValue = input.value;
  refs.btn.classList.remove('hidden');

  if (inputValue.length > 0) {
    fetchImages(inputValue, page, API_key).then(images => {
      addToMarkup(images);
      refs.btn.classList.add('hidden');
    });
  }

  const infScroll = new InfiniteScroll(refs.galleryList, {
    responseType: 'text',
    history: false,
    path: function () {
      refs.btn.classList.remove('hidden');
      return `https://cors-anywhere.herokuapp.com/https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${inputValue}&page=${
        page + 1
      }&per_page=12&key=${API_key}`;
    },
  });

  infScroll.on('load', response => {
    const result = JSON.parse(response);
    addToMarkup(result.hits);
    page++;
    refs.btn.classList.add('hidden');
  });

  refs.galleryList.addEventListener('click', e => {
    if (e.target.nodeName === 'IMG') {
      currentIndex = Number.parseInt(e.target.dataset.index);
      lightBox = basicLightbox.create(
        `<img width="1280" src="${e.target.dataset.src}">`,
        {
          onClose: () => (currentIndex = 0),
        },
      );
      lightBox.show();
      window.addEventListener('keydown', closeLightBox);
    }
  });

  event.currentTarget.reset();
});

function closeLightBox(e) {
  if (e.code === 'Escape') {
    lightBox.close();
    window.removeEventListener('keydown', closeLightBox);
  } else if (
    e.code === 'ArrowRight' &&
    currentIndex != refs.galleryList.children.length - 1
  ) {
    const nextImage =
      refs.galleryList.children[currentIndex + 1].firstElementChild
        .firstElementChild.firstElementChild.dataset.src;
    currentIndex++;
    const lightBoxRef = document.querySelector('.basicLightbox__placeholder');
    lightBoxRef.firstChild.setAttribute('src', nextImage);
  } else if (e.code === 'ArrowLeft' && currentIndex != 0) {
    const nextImage =
      refs.galleryList.children[currentIndex - 1].firstElementChild
        .firstElementChild.firstElementChild.dataset.src;
    currentIndex--;
    const lightBoxRef = document.querySelector('.basicLightbox__placeholder');
    lightBoxRef.firstChild.setAttribute('src', nextImage);
  }
}
