
const filters = document.querySelectorAll('select.js-filter');
const form = document.getElementById('archive-filters');
const handleChangeFilter = (e) => {
  const filterBy = e.currentTarget.name;
  window.logEvent('Explore', `Filter by ${filterBy}`, e.currentTarget.value);
  form.submit();
};

if (filters.length && form) {
  filters.forEach((filter) => {
    filter.addEventListener('change', handleChangeFilter);
  });
}
