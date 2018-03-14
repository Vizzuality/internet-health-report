import { csvParse } from 'd3-dsv';
import tippy from 'tippy.js/dist/tippy.min';
import textures from 'textures';

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

  get WPDictionary() {
    /* eslint-disable no-underscore-dangle */
    if (!this._WPDictionary) {
      this._WPDictionary = csvParse(this.config.dictionary)
        .map(o => ({ [o.key]: o.value }))
        .reduce((res, o) => Object.assign(res, o), {});
    }

    return this._WPDictionary;
    /* eslint-enable no-underscore-dangle */
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

  get colors() { // eslint-disable-line class-methods-use-this
    return [
      '#FF5C73',
      '#5FA1F4',
      '#76E1F4',
      '#6DD8AF',
      '#FFE159',
      '#9D45E3'
    ];
  }

  get color() { // eslint-disable-line class-methods-use-this
    return window.COLOR || this.colors[0];
  }

  get patterns() {
    // We create the patterns once
    if (!this._patterns) { // eslint-disable-line no-underscore-dangle
      const blank = textures.lines()
        .stroke('transparent')
        .background(this.color);

      const linesA = textures.lines()
        .orientation('1/8')
        .size(10)
        .lighter()
        .stroke('#000')
        .background(this.color);

      const linesB = textures.lines()
        .orientation('6/8')
        .size(20)
        .lighter()
        .stroke('#000')
        .background(this.color);

      const linesC = textures.lines()
        .orientation('2/8', '6/8')
        .size(6)
        .lighter()
        .stroke('#000')
        .background(this.color);

      const linesD = textures.lines()
        .orientation('2/8')
        .size(4)
        .lighter()
        .stroke('#000')
        .background(this.color);


      const dotsA = textures.circles()
        .complement()
        .size(8)
        .lighter()
        .fill('#000')
        .background(this.color);

      const dotsB = textures.circles()
        .complement()
        .size(8)
        .radius(0.5)
        .fill('#000')
        .background(this.color);

      const dotsC = textures.circles()
        .complement()
        .size(8)
        .fill('#000')
        .background(this.color);

      this._patterns = [ // eslint-disable-line no-underscore-dangle
        blank,
        linesA,
        dotsC,
        dotsA,
        linesB,
        linesC,
        linesD,
        dotsB
      ];
    }

    return this._patterns; // eslint-disable-line no-underscore-dangle
  }

  get width() {
    return this.config.width || this.el.offsetWidth;
  }

  get height() {
    return this.config.height || 600;
  }

  get padding() {
    return this.config.padding || 0;
  }

  get direction() {
    return this.config.direction || 'vertical';
  }

  get labelFormat() {
    return this.config.labelFormat || '';
  }

  get valueFormat() {
    return this.config.valueFormat || '';
  }

  get valueAxisTitle() {
    return this.WPDictionary.valueAxisTitle;
  }

  get labelAxisTitle() {
    return this.WPDictionary.labelAxisTitle;
  }

  get valueSize() {
    return this.config.valueSize
      || (this.direction === 'horizontal' ? 20 : 10);
  }

  get titleSize() {
    return this.config.titleSize || 40;
  }

  get titleBounds() {
    return {
      x: 0,
      y: 0,
      width: this.width - (2 * this.padding),
      height: this.titleSize
    };
  }

  get legendBounds() {
    return {
      x: 2, // Avoid the border to be cut if no padding
      y: this.titleBounds.y + this.titleBounds.height,
      width: this.width - (2 * this.padding),
      height: this.config.legendRows * this.titleSize
    };
  }

  get valueAxisTitleSize() {
    if (this.valueAxisTitle) {
      return this.config.valueAxisTitleSize || 30;
    }
    return 0;
  }

  get valueAxisTitleBounds() {
    if (this.direction === 'horizontal') {
      return {
        x: 0,
        y: this.height - (2 * this.padding) - this.valueAxisTitleSize,
        width: this.width - (2 * this.padding)
          - this.labelAxisTitleSize - this.labelAxisTitleSize - this.valueSize,
        height: this.valueAxisTitleSize
      };
    }

    const y = this.legendBounds.y + this.legendBounds.height + this.valueSize;

    return {
      x: this.width - (2 * this.padding) - this.valueAxisTitleSize,
      y,
      width: this.valueAxisTitleSize,
      height: this.height - (2 * this.padding) - y
        - this.labelAxisTitleSize - this.labelAxisSize
    };
  }

  get valueAxisTicks() {
    return this.config.valueAxisTicks || 5;
  }

  get valueAxisSize() {
    return this.config.valueAxisSize !== undefined && this.config.valueAxisSize !== null
      ? this.config.valueAxisSize
      : 30;
  }

  get valueAxisBounds() {
    if (this.direction === 'horizontal') {
      return {
        x: this.labelAxisTitleSize + this.labelAxisSize,
        y: this.height - (2 * this.padding) - this.valueAxisTitleSize - this.valueAxisSize,
        width: this.width - (2 * this.padding)
          - this.labelAxisTitleSize - this.labelAxisSize - this.valueSize,
        height: this.valueAxisSize
      };
    }

    const y = this.legendBounds.y + this.legendBounds.height + this.valueSize;
    return {
      x: this.valueAxisTitleBounds.x - this.valueAxisSize,
      y,
      width: this.valueAxisSize,
      height: this.height - (2 * this.padding) - y - this.labelAxisTitleSize - this.labelAxisSize
    };
  }

  get labelAxisTitleSize() {
    if (this.labelAxisTitle) {
      return this.config.labelAxisTitleSize || 20
        || (this.direction === 'horizontal' ? 30 : 20);
    }
    return 0;
  }

  get labelAxisTitleBounds() {
    if (this.direction === 'horizontal') {
      const y = this.legendBounds.y + this.legendBounds.height;
      return {
        x: 0,
        y,
        width: this.labelAxisTitleSize,
        height: this.height - (2 * this.padding) - y - this.valueAxisTitleSize - this.valueAxisSize
      };
    }

    return {
      x: 0,
      y: this.height - (2 * this.padding) - this.labelAxisTitleSize,
      width: this.width - (2 * this.padding) - this.valueAxisSize - this.valueAxisTitleSize,
      height: this.labelAxisTitleSize
    };
  }

  get labelAxisSize() {
    // eslint-disable-next-line no-nested-ternary
    return this.config.labelAxisSize !== undefined && this.config.labelAxisSize !== null
      ? this.config.labelAxisSize
      : (this.direction === 'horizontal' ? 70 : 30);
  }

  get labelAxisBounds() {
    if (this.direction === 'horizontal') {
      const y = this.legendBounds.y + this.legendBounds.height;
      return {
        x: this.labelAxisTitleSize,
        y,
        width: this.labelAxisSize,
        height: this.height - (2 * this.padding) - y - this.valueAxisTitleSize - this.valueAxisSize
      };
    }

    return {
      x: 0,
      y: this.height - (2 * this.padding) - this.labelAxisTitleBounds.height - this.labelAxisSize,
      width: this.labelAxisTitleBounds.width,
      height: this.labelAxisSize
    };
  }

  get visualizationBounds() {
    if (this.direction === 'horizontal') {
      const y = this.legendBounds.y + this.legendBounds.height;
      return {
        x: this.labelAxisTitleSize + this.labelAxisSize,
        y,
        width: this.width - (2 * this.padding) - this.labelAxisTitleSize - this.labelAxisSize,
        height: this.height - y - (2 * this.padding) - this.valueAxisTitleSize - this.valueAxisSize
      };
    }

    const y = this.legendBounds.y + this.legendBounds.height + this.valueSize;

    return {
      x: 0,
      y,
      width: this.width - (2 * this.padding) - this.valueAxisTitleSize - this.valueAxisSize,
      height: this.height - y - (2 * this.padding) - this.labelAxisTitleSize - this.labelAxisSize
    };
  }

  constructor(el, config) {
    this.el = el;
    this.config = config;

    // This value is dynamically updated by the visualization
    this.config.legendRows = 1;
  }

  /**
   * Instantiate the tooltip for the target elements
   * @param {string} target HTML/CSS selector
   * @param {string} [trigger='mouseenter focus'] Event(s) to trigger the tooltip
   * @param {string} [additionalClass=''] CSS class to add
   * @return {any} tippy instance
   */
  instantiateTooltip(target, trigger = 'mouseenter focus', additionalClass = '') {
    const getTooltipContent = this.getTooltipContent.bind(this);
    return tippy(this.el, {
      target,
      animateFill: false,
      animation: 'shift-toward',
      inertia: true,
      theme: 'ihr',
      html: document.createElement('div'),
      sticky: true,
      arrow: true,
      interactive: true,
      trigger,
      wait(show, e) {
        // Callback to be executed when the tooltip is inserted in
        // the dom
        let callback = () => {};

        // FIXME: We hack tippy here to not have to inject
        // the result of getTooltipContent in the DOM
        // Referencing a virtual node in `html` doesn't
        // work because it can't be re-used
        const container = document.createElement('div');
        container.classList.add('c-tooltip', 'js-tooltip');
        container.innerHTML = getTooltipContent(e.target, (func) => { callback = func; });

        // We add the additional class
        this.children[0].classList.add(additionalClass);

        const tooltip = this.querySelector('.tippy-content');
        tooltip.innerHTML = '';
        tooltip.appendChild(container);

        // We execute the callback
        callback(container);

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
    this.el.classList.add('v-visualization', `-${this.direction}`);

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
