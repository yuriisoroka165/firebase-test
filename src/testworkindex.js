import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

galleryItems = [
  {
    webformatURL:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825__340.jpg',
    largeImageURL:
      'https://cdn.pixabay.com/photo/2019/05/14/16/43/himilayan-blue-poppy-4202825_1280.jpg',
    tags: 'Hokkaido Flower',
  },
  {
    webformatURL:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg',
    largeImageURL:
      'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg',
    tags: 'Container Haulage Freight',
  },
  {
    webformatURL:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg',
    largeImageURL:
      'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
    tags: 'Aerial Beach View',
  },
  {
    webformatURL:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg',
    largeImageURL:
      'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg',
    tags: 'Flower Blooms',
  },
  {
    webformatURL:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg',
    largeImageURL:
      'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg',
    tags: 'Alpine Mountains',
  },
  {
    webformatURL:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg',
    largeImageURL:
      'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg',
    tags: 'Mountain Lake Sailing',
  },
  {
    webformatURL:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg',
    largeImageURL:
      'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg',
    tags: 'Alpine Spring Meadows',
  },
  {
    webformatURL:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg',
    largeImageURL:
      'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg',
    tags: 'Nature Landscape',
  },
  {
    webformatURL:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg',
    largeImageURL:
      'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg',
    tags: 'Lighthouse Coast Sea',
  },
];

refs = {
    gallery: document.querySelector('.gallery'),
    searchForm: document.querySelector('.search-form'),
    search: document.querySelector('.search-button'),
}


refs.searchForm.addEventListener('submit', onSearch);

function onSearch(event) {
    event.preventDefault();
    // refs.gallery.insertAdjacentHTML('beforeend', galleryItemsMArkup(galleryItems));
}


function galleryItemsMArkup(items) {
    return items
        .map(({ webformatURL, largeImageURL, tags }) => {
            return `
                <a class="gallery__item" href="${largeImageURL}">
                    <img class="gallery__image" src="${webformatURL}" alt="${tags}" />
                </a>
            `;}).join('');
}

refs.gallery.insertAdjacentHTML('beforeend', galleryItemsMArkup(galleryItems));

new SimpleLightbox('.gallery a', {
});