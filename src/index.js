import 'bootstrap/dist/css/bootstrap.min.css';
import 'basiclightbox/src/styles/main.scss';
import './styles.css';
import 'bootstrap';
import 'infinite-scroll';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/PNotify.css';
import { alert, notice, info, success, error } from '@pnotify/core';
import * as basicLightbox from 'basiclightbox';
import refs from './js/refs.js';
import fetchImages from './js/apiService.js';
import addToMarkup from './js/addToMarkup.js';

const API_key = '18582264-4fafc4bd5c65c2ee349044428';

let page = 1;
let inputValue;
let lightBox;
let currentIndex = 0;

refs.form.addEventListener('submit', event => {
  event.preventDefault();
  page = 1; //для поиска с 1 первой страницы
  refs.galleryList.innerHTML = ''; //зачищаем перед новым запросом
  const input = event.target.elements[0];
  inputValue = input.value; //записываем значение
  refs.btn.classList.remove('hidden'); //показываем кнопку загрузки

  if (inputValue.length > 0) {
    //запрос только при условии не пустой формы
    fetchImages(inputValue, page, API_key).then(
      images => {
        addToMarkup(images); //добавляем в разметку
        refs.btn.classList.add('hidden'); //убираем кнопку после загрузки
        if (images.length <= 0) {
          showNotice();
        }
      },
      onRej => {
        refs.btn.classList.add('hidden'); //убираем кнопку после загрузки
        showError(onRej);
      },
    ); //показываем ошибку если она есть
  }

  const infScroll = new InfiniteScroll(refs.galleryList, {
    responseType: 'text',
    history: false,
    path: function () {
      refs.btn.classList.remove('hidden'); //показываем кнопку загрузки
      return `https://cors-anywhere.herokuapp.com/https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${inputValue}&page=${page++}&per_page=12&key=${API_key}`;
    },
  });

  infScroll.on('load', response => {
    //добавляем слушатель
    const result = JSON.parse(response); //записываем результат
    addToMarkup(result.hits); //добавляем в разметку
    page++; //appending page
    refs.btn.classList.add('hidden'); //убираем кнопку после загрузки
  });

  refs.galleryList.addEventListener('click', e => {
    if (e.target.nodeName === 'IMG') {
      //если клацаем на фото
      currentIndex = Number.parseInt(e.target.dataset.index); //запоминаем текущий индекс
      lightBox = basicLightbox.create(
        //создаем модалку с фоткой
        `<img width="1280" src="${e.target.dataset.src}">`,
        {
          onClose: () => (currentIndex = 0), //при закрытии модалки текущий индекс 0
        },
      );
      lightBox.show(); //показываем модалку
      window.addEventListener('keydown', controlsLightBox); //слушаем кнопки
    }
  });

  event.currentTarget.reset(); //чистим форму после поиска
});

function controlsLightBox(e) {
  if (e.code === 'Escape') {
    lightBox.close(); //закрываем модалку
    window.removeEventListener('keydown', controlsLightBox); //убираем слушатель
  } else if (
    e.code === 'ArrowRight' &&
    currentIndex != refs.galleryList.children.length - 1 //если кнопка -> и не последний элемент в списке
  ) {
    const nextImage =
      refs.galleryList.children[currentIndex + 1].firstElementChild
        .firstElementChild.firstElementChild.dataset.src; //ищем следующую фотку в списке
    currentIndex++; //добавляем индекс
    const lightBoxRef = document.querySelector('.basicLightbox__placeholder'); //ищем модалку
    lightBoxRef.firstChild.setAttribute('src', nextImage); //меняем фото
  } else if (e.code === 'ArrowLeft' && currentIndex != 0) {
    //если кнопка <- и не первый элемент в списке
    const previousImage =
      refs.galleryList.children[currentIndex - 1].firstElementChild
        .firstElementChild.firstElementChild.dataset.src; //ищем предыдущую фотку в списке
    currentIndex--; //минусим индекс
    const lightBoxRef = document.querySelector('.basicLightbox__placeholder'); //ищем модалку
    lightBoxRef.firstChild.setAttribute('src', previousImage); //меняем фото
  }
}
function showError(errorFetch) {
  return error({
    title: 'Error!',
    text: errorFetch,
    animateSpeed: 'normal',
    delay: 5000,
  });
}
function showNotice() {
  return notice({
    text: 'Не найдено результатов, попробуйте еще',
    animateSpeed: 'fast',
    delay: 1000,
  });
}
