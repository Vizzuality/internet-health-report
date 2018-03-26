import Visualization from 'components/Visualization';
import visualizations from 'data/visualizations';

export default class PostPage {
  /**
   * Instantiate the visualizations
   */
  static instiantiateVisualizations() {
    (window.VISUALIZATIONS || [])
      .forEach((vis) => {
        const container = document.querySelector(`#${vis.id}`);
        if (container) {
          // eslint-disable-next-line no-new
          new Visualization(container, Object.assign({}, vis, visualizations[vis.id] || {}));
        }
      });
  }

  /**
   * Make the close button a back button if the user comes from
   * the issue page to maintain the scroll position
   */
  static enhanceCloseButton(Router) {
    const closeButton = document.querySelector('.js-close-button');
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        const pageHistory = Router.getPageHistory();
        if (pageHistory.length > 1) {
          const previousPage = pageHistory[1];
          // eslint-disable-next-line no-useless-escape
          if (previousPage.page === 'IssuePage' && new RegExp(`/${window.CATEGORY}((\/?\?.*)|\/)?$`).test(previousPage.url)) {
            e.preventDefault();
            history.back();
          }
        }
      });
    }
  }

  constructor(route, options, Router) {
    PostPage.instiantiateVisualizations();
    PostPage.enhanceCloseButton(Router);
  }
}
