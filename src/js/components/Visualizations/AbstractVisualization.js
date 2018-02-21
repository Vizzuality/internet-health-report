import { csvParse } from 'd3-dsv';

// Data
import DictionaryEN from 'data/dictionary-en';
import DictionaryFR from 'data/dictionary-fr';

export default class AbstractVisualization {
  get dictionary() { // eslint-disable-line class-methods-use-this
    return {
      en: DictionaryEN,
      fr: DictionaryFR
    }[window.LANG] || {};
  }

  get id() {
    return this.config.id;
  }

  get title() {
    return this.config.dictionary.title || this.dictionary.missing_title;
  }

  get description() {
    return this.config.dictionary.description || this.dictionary.missing_description;
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
    return fetch(this.config.file)
      .then(res => res.text())
      .then((csv) => {
        const data = csv.replace(/\{\{(.*)\}\}/g, (_, key) => this.config.dictionary[`${key}`] || key);
        this.data = csvParse(data);
      });
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
