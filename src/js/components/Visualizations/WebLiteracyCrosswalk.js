import { parse } from 'vega-parser';
import { View } from 'vega';
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
    jsonSpec.width = this.width;
    jsonSpec.height = this.height;

    return jsonSpec.data.map((d) => {
      if (d.name === 'data') {
        return Object.assign({}, d, { values: this.data });
      }
      return d;
    });
  }

  renderChart() {
    const { el } = this;

    // Vega
    const runtime = parse(this.vegaSpec());
    new View(runtime) // eslint-disable-line no-new
      .initialize(el)
      .renderer('svg')
      .hover()
      .run();
  }

  render() {
    super.render();
    this.renderChart();
  }
}
