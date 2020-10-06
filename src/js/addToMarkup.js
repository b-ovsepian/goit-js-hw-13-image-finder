import imageTpl from '../templates/imageCard.hbs';
import refs from './refs.js';

function updateMarkup(images) {
  const markup = imageTpl(images);
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
}

export default updateMarkup;
