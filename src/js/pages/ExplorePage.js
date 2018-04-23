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

    filters.forEach(filter => new EnhancedSelect(filter, (option) => {
      const filterName = option.parentElement.getAttribute('name');
      const value = option.textContent;
      window.logEvent('Explore', `Filter by ${filterName}`, value);
      setTimeout(() => form.submit(), 200);
    }));
  }
}
