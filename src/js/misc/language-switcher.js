// This code is for the language selector located
// in the footer
const el = document.querySelector('.js-language-switcher');
if (el) {
  el.addEventListener('change', ({ target }) => {
    window.logEvent('Change Language', 'Clicks to change language', target.selectedOptions[0].getAttribute('data-lang'));
    window.location = target.value;
  });
}
