import { select } from 'd3-selection';
import AbstractVisualization from 'components/Visualizations/AbstractVisualization';
import jsonSpec from 'components/Visualizations/WebLiteracyCrosswalk-spec.json';

let vega = null;

export default class WebLiteracyCrosswalk extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    import(/* webpackChunkName: "vega" */ 'vega')
      .then((lib) => {
        vega = lib;
        this.initialize();
        this.setListeners();
      });
  }

  initialize() {
    // fetch and then render
    this.fetchData()
      .then(() => this.render());
  }

  getTooltipContent(target) { // eslint-disable-line class-methods-use-this
    const { datum } = select(target).datum();

    return `
      <div class="web-literacy-crosswalk">
        <p class="title">${datum.subcategory}</p>
        <p class="label">${datum.category}</p>
        <p>${datum.description}</p>
      </div
    `;
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

  render() {
    super.render();
    if (!this.data) return;

    this.el.classList.add('v-web-literacy-crosswalk');

    const runtime = vega.parse(this.vegaSpec());

    new vega.View(runtime) // eslint-disable-line no-new
      .logLevel(vega.Warn)
      .initialize(this.el)
      .renderer('svg')
      .runAsync()
      .then(() => {
        this.svg = select(this.el.querySelector('svg'));

        this.svg
          .attr('width', this.width * this.scale)
          .attr('height', this.height * this.scale)
          .attr('viewBox', `0 0 ${this.width} ${this.height}`)
          .attr('role', 'img')
          .attr('aria-labelledby', `title_${this.id} desc_${this.id}`);

        this.svg.append('title')
          .attr('id', `title_${this.id}`)
          .text(this.title);

        this.svg.append('desc')
          .attr('id', `desc_${this.id}`)
          .text(this.description);

        this.el.setAttribute('title', this.title);
        this.instantiateTooltip('.mark-arc path');
      });
  }
}
