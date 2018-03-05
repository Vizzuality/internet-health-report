import { csvParse } from 'd3-dsv';
import tippy from 'tippy.js';

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
   * Instantiate the tooltip for the target elements
   * @param {string} target HTML/CSS selector
   */
  instantiateTooltip(target) {
    const getTooltipContent = this.getTooltipContent.bind(this);
    tippy(this.el, {
      target,
      animateFill: false,
      animation: 'shift-toward',
      inertia: true,
      theme: 'ihr',
      html: document.createElement('div'),
      sticky: true,
      arrow: true,
      interactive: true,
      wait(show, e) {
        // FIXME: We hack tippy here to not have to inject
        // the result of getTooltipContent in the DOM
        // Referencing a virtual node in `html` doesn't
        // work because it can't be re-used
        const container = document.createElement('div');
        container.classList.add('c-tooltip', 'js-tooltip');
        container.innerHTML = getTooltipContent(e.target);

        const tooltip = this.querySelector('.tippy-content');
        tooltip.innerHTML = '';
        tooltip.appendChild(container);

        show();
      }
    });
  }

  /**
   * Return the content of the tooltip
   * @param {HTMLElement} target DOM node to which the tooltip will
   * be attached
   * @returns {string} HTML string
  */
  getTooltipContent(target) { // eslint-disable-line
    return '';
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
