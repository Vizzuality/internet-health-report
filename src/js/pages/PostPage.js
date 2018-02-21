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

  constructor() {
    PostPage.instiantiateVisualizations();
  }
}
