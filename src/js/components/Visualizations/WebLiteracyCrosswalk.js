import * as vega from 'vega';
import AbstractVisualization from './AbstractVisualization';
import jsonSpec from './WebLiteracyCrosswalk-spec.json';

export default class WebLiteracyCrosswalk extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    this.initialize();
  }

  initialize() {
    // fetch and then render
    this.fetchData()
      .then(() => this.render());
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
      .hover()
      .run();
  }

  render() {
    super.render();
    // this.el.setAttribute('style', `width: ${this.width}px; height: ${this.height}px`);
    this.renderChart();
  }
}
