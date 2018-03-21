import { parse } from 'vega-parser';
import { View, Warn } from 'vega';
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

    spec.data.map((d) => {
      if (d.name === 'data') {
        return Object.assign({}, d, { values: this.data });
      }
      return d;
    });

    return spec;
  }

  renderChart() {
    const { el } = this;
    // console.log(this.vegaSpec());

    // Vega
    const runtime = parse(this.vegaSpec());
    new View(runtime) // eslint-disable-line no-new
      .logLevel(Warn)
      .initialize(el)
      .renderer('svg')
      .hover()
      .run();
  }

  render() {
    super.render();
    this.el.setAttribute('style', `width: ${this.width}px; height: ${this.height}px`);
    this.renderChart();
  }
}
