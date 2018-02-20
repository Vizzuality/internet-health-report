import { csvParse } from 'd3-dsv';

// Data
import DictionaryEN from 'data/dictionary-en';
import DictionaryFR from 'data/dictionary-fr';

export default class AbstractVisualization {
  get uniqueId() {
    /* eslint-disable no-underscore-dangle */
    if (!this.__uniqueId) { //
      this.__uniqueId = +(new Date());
    }

    return this.__uniqueId;
    /* eslint-enable no-underscore-dangle */
  }

  get dictionary() { // eslint-disable-line class-methods-use-this
    return {
      en: DictionaryEN,
      fr: DictionaryFR
    }[window.LANG] || {};
  }

  get title() { // eslint-disable-line class-methods-use-this
    return this.dictionary[`${this.config.id}_title`] || this.dictionary.missing_title;
  }

  get description() { // eslint-disable-line class-methods-use-this
    return this.dictionary[`${this.config.id}_description`] || this.dictionary.missing_description;
  }

  constructor(el, config) {
    this.el = el;
    this.config = config;
  }

  /**
   * Fetch and parse the data of the visualization so it
   * is a translated object stored in this.data
  */
  fetchData() {
    return fetch(`/${window.BASE_URL}/wp-content/themes/ihr-2018/data/${this.config.file}.csv`)
      .then(res => res.text())
      .then((csv) => {
        const data = csv.replace(/\{\{(.*)\}\}/g, (_, key) => this.dictionary[`${this.config.id}_${key}`] || key);
        this.data = csvParse(data);

        // The last row contains the column names
        // so we delete it
        // NOTE: slice returns a shallow copy so
        // this method is more efficient
        this.data.length = this.data.length - 1;
      })
      .catch(() => {});
  }

  render() {
    if (!this.data) {
      this.el.innerHTML = 'Unable to load the data!';
    }
  }

  reload() {
    this.destroy();
    this.render();
  }

  destroy() {
    this.el.innerHTML = null;
  }
}
