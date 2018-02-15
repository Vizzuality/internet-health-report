export default class AbstractVisualization {
  get uniqueId() {
    /* eslint-disable no-underscore-dangle */
    if (!this.__uniqueId) { //
      this.__uniqueId = +(new Date());
    }

    return this.__uniqueId;
    /* eslint-enable no-underscore-dangle */
  }

  constructor(el, config) {
    this.el = el;
    this.config = config;
  }

  render() {}

  reload() {
    this.destroy();
    this.render();
  }

  destroy() {
    this.el.innerHTML = null;
  }
}
