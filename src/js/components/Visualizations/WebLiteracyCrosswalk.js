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

  renderChart() {
    const { el } = this;

    // Vega
    const view = new View(jsonSpec)
      .logLevel(Warn)
      .initialize(el)
      .renderer('svg');

    view.run();
  }

  renderLegend() {
    const { el } = this;
    const legendElement = document.createElement('div');
    legendElement.classList.add('web-literacy-crosswalk-vis-legend');
    legendElement.innerHTML = `<ul>
      <li class="happy-percent-icon">% Happy</li>
      <li class="happy-icon">Happy Average on Screen (minutes)</li>
      <li class="unhappy-icon">Unhappy Average on Screen (minutes)</li>
    </ul>`;
    el.appendChild(legendElement);
  }

  render() {
    this.renderChart();
    // this.renderLegend();
  }
}
