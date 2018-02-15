import Visualization from 'components/Visualization';

export default class PostPage {
  /**
   * Return the container of the visualizations
   * @returns {HTMLElement[]}
   */
  static getVisalizationContainers() {
    return $('.js-visualization').get();
  }

  /**
   * Instantiate the visualizations
   */
  static instiantiateVisualizations() {
    PostPage.getVisalizationContainers()
      .forEach(container => new Visualization(container, $(container).data()));
  }

  constructor() {
    PostPage.instiantiateVisualizations();
  }
}
