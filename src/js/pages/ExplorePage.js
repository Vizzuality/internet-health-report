import EnhancedSelect from 'components/EnhancedSelect';

export default class ExplorePage {
  constructor(_, { baseUrl }) {
    this.baseUrl = baseUrl;
    this.enhanceFilters();
    this.trackKeywordSearch();
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
      // NOTE: form.submit() doesn't fire a submit event so
      // trackKeywordSearch won't fire a second event
      setTimeout(() => form.submit(), 200);
    }));
  }

  trackKeywordSearch() { // eslint-disable-line class-methods-use-this
    const input = document.querySelector('input.js-filter');
    const form = input.closest('form');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.logEvent('Explore', 'Search text', input.value);

        setTimeout(() => form.submit(), 200);
      });
    }
  }
}
