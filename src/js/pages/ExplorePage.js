export default class ExplorePage {
  constructor(_, { baseUrl }) {
    this.baseUrl = baseUrl;
    this.setListeners();
  }

  setListeners() {
    $('.js-search-button').on('click', this.onClickSearch.bind(this));
  }

  /**
   * Event handler executed when the user clicks the
   * search button
   */
  onClickSearch() { // eslint-disable-line class-methods-use-this
    const $filters = $('.js-filter').get();

    const query = $filters
      .map(filter => `${$(filter).data('filter')}=${$(filter).val()}`)
      .reduce((res, s, i) => `${res}${i === 0 ? '?' : '&'}${s}`, '');

    window.location = `${this.baseUrl}/${query}`;
  }
}
