window.fbShare = (url, title, descr, winWidth, winHeight) => {
  const winTop = (screen.height / 2) - (winHeight / 2);
  const winLeft = (screen.width / 2) - (winWidth / 2);
  window.open(`https://www.facebook.com/sharer.php?s=100&p[title]=${title}&p[summary]=${descr}&p[url]=${url}&p[images][0]=`, 'sharer', `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${winWidth},height=${winHeight}`);
};

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
