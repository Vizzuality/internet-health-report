// This code is for the language selector located
// in the footer
const el = document.querySelector('.js-language-switcher');
if (el) {
  el.addEventListener('change', ({ target }) => {
    window.location = target.value;
  });
}
