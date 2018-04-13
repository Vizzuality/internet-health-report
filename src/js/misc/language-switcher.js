import EnhancedSelect from 'components/EnhancedSelect';

// This code is for the language selector located
// in the header and footer
const els = document.querySelectorAll('.js-language-switcher');
if (els.length) {
  els.forEach(el => new EnhancedSelect(el.children[0], (option) => {
    window.logEvent('Change Language', 'Clicks to change language', option.getAttribute('data-lang'));
    window.location = option.value;
  }));
}
