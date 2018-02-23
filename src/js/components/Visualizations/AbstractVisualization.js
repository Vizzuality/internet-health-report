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
    return this.config.title || this.dictionary.missing_title;
  }

  get description() {
    return this.config.description || this.dictionary.missing_description;
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
    const isCSVFile = /\.csv$/.test(this.config.file);

    return fetch(this.config.file, {
      credentials: 'include'
    })
      .then((res) => {
        if (isCSVFile) {
          return res.text();
        }
        return res.json();
      })
      .then((data) => {
        if (isCSVFile) {
          this.data = csvParse(data);
        } else {
          this.data = data;
        }
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
