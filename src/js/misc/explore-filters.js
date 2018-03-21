
const filters = document.querySelectorAll('select.js-filter');
const form = document.getElementById('archive-filters');
const handleChangeFilter = () => { form.submit(); };

if (filters.length && form) {
  filters.forEach((filter) => {
    filter.addEventListener('change', handleChangeFilter);
  });
}
