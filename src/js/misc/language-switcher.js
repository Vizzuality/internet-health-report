// This code is for the language selector located
// in the header and footer
const els = document.querySelectorAll('.js-language-switcher');
if (els.length) {
  els.forEach((el) => {
    el.addEventListener('change', ({ target }) => {
      window.logEvent('Change Language', 'Clicks to change language', target.selectedOptions[0].getAttribute('data-lang'));
      window.location = target.value;
    });
  });
}
