import axios from 'axios';

export default class ConnectToImageService {
    constructor() {
        this.apiKey = '33457552-f72b8f2d874a669f815eb264f'
        this.searchQuery = '';
        this.image_type = 'photo';
        this.orientation = 'horizontal';
        this.safesearch = 'true';
        this.page = 1;
        this.per_page = 40;
    }

    async fetchItems() {
        const queryUrl = `https://pixabay.com/api/?key=${this.apiKey}&q=${this.searchQuery}&image_type=${this.image_type}&orientation=${this.orientation}&safesearch=${this.safesearch}&page=${this.page}&per_page=${this.per_page}`;
        return await axios.get(queryUrl)
            .then(response => {
                this.incrementPage();
                console.log(response.data);
                return response.data;
            });
    }   

    resetPage() {
        this.page = 1;
    }

    incrementPage() {
        this.page += 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}