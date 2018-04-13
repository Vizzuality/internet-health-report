import EnhancedSelect from 'components/EnhancedSelect';

export default class ExplorePage {
  constructor(_, { baseUrl }) {
    this.baseUrl = baseUrl;
    this.enhanceFilters();
  }

  enhanceFilters() { // eslint-disable-line class-methods-use-this
    const filters = document.querySelectorAll('select.js-filter');
    const form = filters.length
      ? filters[0].closest('form')
      : null;

    filters.forEach(filter => new EnhancedSelect(filter, () => form.submit()));
  }
}
