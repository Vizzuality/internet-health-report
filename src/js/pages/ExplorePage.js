export default class ExplorePage {
  constructor(_, { baseUrl }) {
    this.baseUrl = baseUrl;
    this.setListeners();
  }

  setListeners() {
    const searchButton = document.querySelector('.js-search-button');
    if (searchButton) {
      searchButton.addEventListener('click', this.onClickSearch.bind(this));
    }
  }

  /**
   * Event handler executed when the user clicks the
   * search button
   */
  onClickSearch() { // eslint-disable-line class-methods-use-this
    const filters = Array.prototype.slice.call(document.querySelectorAll('.js-filter'));

    const query = filters
      .map(filter => `${filter.getAttribute('data-filter')}=${filter.value}`)
      .reduce((res, s, i) => `${res}${i === 0 ? '?' : '&'}${s}`, '');

    window.location = `${this.baseUrl}/${query}`;
  }
}
