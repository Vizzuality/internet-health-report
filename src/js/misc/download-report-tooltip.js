import tippy from 'tippy.js/dist/tippy.min';

let downloadItems = [];

const onDownloadItem = (e) => {
  const action = e.currentTarget.getAttribute('data-ga-action');
  const label = e.currentTarget.getAttribute('data-ga-label');
  window.logEvent('Download', action, label);
};

const trackDownloadinks = () => {
  downloadItems = document.querySelectorAll('.ga-download-link');
  (downloadItems || []).forEach((downloadItem) => {
    downloadItem.addEventListener('click', onDownloadItem);
  });
};

const removeTrackDownloadLinks = () => {
  (downloadItems || []).forEach((downloadItem) => {
    downloadItem.removeEventListener('click', onDownloadItem);
  });
};

const triggerElements = document.querySelectorAll('.download-tooltip-trigger');

if (triggerElements.length) {
  triggerElements.forEach((triggerElement) => {
    const tooltipContent = triggerElement.nextElementSibling;

    tippy(triggerElement, {
      html: tooltipContent,
      arrow: true,
      placement: 'bottom',
      theme: 'ihr',
      interactive: true,
      distance: 15,
      zIndex: 51,
      onShow: () => { tooltipContent.removeAttribute('style'); },
      onShown: () => { trackDownloadinks(); },
      onHidden: () => {
        removeTrackDownloadLinks();
        tooltipContent.setAttribute('style', 'display: none');
      }
    });
  });
}
