import Visualization from 'components/Visualization';

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
          new Visualization(container, Object.assign({}, vis.options, {
            id: vis.id,
            file: vis.file,
            type: vis.type
          }));
        }
      });
  }

  constructor() {
    PostPage.instiantiateVisualizations();
  }
}
