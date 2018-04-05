
const trackSocial = () => {
  const socialItems = document.querySelectorAll('.social-item');
  (socialItems || []).forEach((socialItem) => {
    socialItem.addEventListener('click', (e) => {
      const story = e.currentTarget.getAttribute('data-ga-action');
      const social = e.currentTarget.getAttribute('data-ga-label');

      window.logEvent('Share', story, social);
    });
  });
};

window.addEventListener('DOMContentLoaded', trackSocial);
