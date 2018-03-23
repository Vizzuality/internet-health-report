import { select } from 'd3-selection';
import tippy from 'tippy.js/dist/tippy.min';
import AbstractVisualization from './AbstractVisualization';
import jsonSpec from './WebLiteracyCrosswalk-spec.json';

let vega = null;

export default class WebLiteracyCrosswalk extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    import(/* webpackChunkName: "vega" */ 'vega')
      .then((lib) => {
        vega = lib;
        this.initialize();
      });
  }

  initialize() {
    // fetch and then render
    this.fetchData()
      .then(() => this.render());
  }

  getTooltipContent(target) { // eslint-disable-line class-methods-use-this
    const { datum } = select(target).datum();
    const { dictionary } = this;

    return `
      <p class="title">${datum.subcategory}</p>
      <p class="note">${datum.category}</p>
      <p class="number" style="color: ${this.color}">${(datum.value === 1 ? dictionary.yes : dictionary.no)}</p>
      <p class="note" style="max-width: 200px">${datum.label}</p>
    `;
  }

  /**
   * Instantiate the tooltip for the target elements
   * @param {string} target HTML/CSS selector
   * @param {string} [trigger='mouseenter focus'] Event(s) to trigger the tooltip
   * @param {boolean} [sticky=true] Whether the tooltip follows the target
   * @param {string} additionalClass CSS class to add
   * @return {any} tippy instance
   */
  instantiateTooltip(target, trigger = 'mouseenter focus', sticky = true, additionalClass) {
    const getTooltipContent = this.getTooltipContent.bind(this);
    return tippy(target, {
      animateFill: false,
      animation: 'shift-toward',
      inertia: true,
      theme: 'ihr',
      html: document.createElement('div'),
      sticky,
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
        if (additionalClass) {
          this.children[0].classList.add(additionalClass);
        }

        const tooltip = this.querySelector('.tippy-content');
        tooltip.innerHTML = '';
        tooltip.appendChild(container);

        // We execute the callback
        callback(container);

        show();
      },
      onHide: this.onHideTooltip.bind(this)
    });
  }

  vegaSpec() {
    const spec = Object.assign({}, jsonSpec);
    spec.width = this.width;
    spec.height = this.height;
    spec.padding = this.padding;

    spec.data = spec.data.map((d) => {
      if (d.name === 'data') {
        return Object.assign({}, d, { values: this.data });
      }
      return d;
    });

    return spec;
  }

  renderChart() {
    const { el } = this;

    // Vega
    const runtime = vega.parse(this.vegaSpec());

    new vega.View(runtime) // eslint-disable-line no-new
      .logLevel(vega.Warn)
      .initialize(el)
      .renderer('svg')
      .run();

    setTimeout(() => this.instantiateTooltip(document.querySelectorAll('.mark-arc path')), 10); // :hankey:
  }

  render() {
    if (!this.data) {
      this.el.innerHTML = 'Unable to load the data!';
    }

    this.renderChart();
  }
}
