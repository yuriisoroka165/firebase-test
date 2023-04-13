import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import ConnectToImageService from './js/api';

const refs = {
    gallery: document.querySelector('.gallery'),
    searchForm: document.querySelector('.search-form'),
    search: document.querySelector('.search-button'),
    loadMoreButton: document.querySelector('.load-more'),
}

const newConnection = new ConnectToImageService();
const initGallery = new SimpleLightbox('.gallery a', {});

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onLoadMore);

function onSearch(event) {
    event.preventDefault();
    
    loadMoreButtonDisable();
    clearGallery();
        
    newConnection.query = event.currentTarget.elements.searchQuery.value;
    if (newConnection.query === '') {
        Notiflix.Notify.warning('Please enter search words...');
        return;
    }

    newConnection.resetPage();
    newConnection.fetchItems()
        .then(items => {
            const totalHits = items.total;
            if (totalHits === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                return;
            } else if (totalHits > 0){
                Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
                refs.gallery.insertAdjacentHTML('beforeend', galleryItemsMArkup(items.hits));                
                initGallery.refresh();
                loadMoreButtonEnable();
            }
        });
}

function onLoadMore(event) {
    newConnection.fetchItems()
        .then(items => {
            refs.gallery.insertAdjacentHTML('beforeend', galleryItemsMArkup(items.hits));
            initGallery.refresh();
            if (items.hits.length < newConnection.per_page) {
                loadMoreButtonDisable();
                Notiflix.Notify.warning('We\'re sorry, but you\'ve reached the end of search results.');
            }
        });
}

function galleryItemsMArkup(items) {
    return items
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `
                <a href="${largeImageURL}" class="photo-card">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery__image"/>
                    <div class="info">
                        <p class="info-item">
                        <b>Likes</b>
                        ${likes}
                        </p>
                        <p class="info-item">
                        <b>Views</b>
                        ${views}
                        </p>
                        <p class="info-item">
                        <b>Comments</b>
                        ${comments}
                        </p>
                        <p class="info-item">
                        <b>Downloads</b>
                        ${downloads}
                        </p>
                    </div>
                </a>
            `;}).join('');
}

function clearGallery() {
    refs.gallery.innerHTML = ''; 
}

function loadMoreButtonEnable() {
        refs.loadMoreButton.classList.remove("is-hidden");
        refs.loadMoreButton.disabled = false;
}

function loadMoreButtonDisable() {
    refs.loadMoreButton.classList.add("is-hidden");
    refs.loadMoreButton.disabled = true;
}