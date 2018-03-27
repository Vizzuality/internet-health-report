import tippy from 'tippy.js/dist/tippy.min';

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
      onShow: () => {
        tooltipContent.removeAttribute('style');
      },
      onHidden: () => {
        tooltipContent.setAttribute('style', 'display: none');
      }
    });
  });
}
