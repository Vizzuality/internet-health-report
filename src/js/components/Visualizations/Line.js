import { select } from 'd3-selection';
import { scaleUtc, scaleLinear, scaleOrdinal, scaleBand } from 'd3-scale';
import { max, extent } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { line as d3Line } from 'd3-shape';
import { schemeCategory10 } from 'd3-scale-chromatic';

import AbstractVisualization from 'components/Visualizations/AbstractVisualization';

export default class Line extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);

    this.config = config;
    this.config.height = 600;
    this.config.padding = 20;
    this.config.horizontalAxisSize = this.config.horizontalAxisSize || 20;
    this.config.verticalAxisSize = this.config.verticalAxisSize || 70;
    this.config.legendSize = 50;

    this.initialize();
  }

  initialize() {
    this.fetchData()
      .then(() => {
        // We properly format the labels as dates and
        // the values as numbers
        this.data = this.data.map(d => Object.assign(d, {
          label: new Date(Date.UTC(+d.label, 0)),
          value: +d.value
        }));
      })
      .catch(() => {})
      .then(() => this.render());
  }

  render() {
    super.render();
    if (!this.data) return;

    const width = this.el.offsetWidth;
    const height = this.config.height;

    const svg = select(this.el).append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('role', 'img')
      .attr('aria-labelledby', `title_${this.id} desc_${this.id}`);

    svg.append('title')
      .attr('id', `title_${this.id}`)
      .text(this.title);

    svg.append('desc')
      .attr('id', `desc_${this.id}`)
      .text(this.description);

    const labels = this.data.map(d => d.label)
      .filter((d, i, arr) => arr.indexOf(d) === i);

    const categories = this.data.map(d => d.category)
      .filter((d, i, arr) => arr.indexOf(d) === i);

    const labelScale = scaleUtc()
      .domain(extent(labels))
      .rangeRound([0, width - this.config.verticalAxisSize - (2 * this.config.padding)]);

    const valueScale = scaleLinear()
      .domain([0, max(this.data, d => d.value)])
      .rangeRound([height - (2 * this.config.padding) - this.config.horizontalAxisSize - this.config.legendSize, 0]);

    const legendScale = scaleBand()
      .domain(categories)
      .rangeRound([0, width - (2 * this.config.padding)]);

    const colorScale = scaleOrdinal(schemeCategory10)
      .domain(categories);

    const labelAxis = axisBottom(labelScale)
      .tickPadding(10)
      .tickSize(0);

    const valueAxis = axisLeft(valueScale)
      .tickPadding(10)
      .tickSize(0);

    const line = d3Line()
      .x(d => labelScale(d.label))
      .y(d => valueScale(d.value));

    const container = svg.append('g')
      .attr('transform', `translate(${this.config.padding}, ${this.config.padding})`);

    container.append('g')
      .attr('class', 'lines')
      .attr('transform', `translate(${this.config.verticalAxisSize}, 0)`)
      .selectAll('path')
      .data(categories)
      .enter()
      .append('path')
      .attr('stroke', c => colorScale(c))
      .attr('stroke-width', 2)
      .attr('fill', 'transparent')
      .attr('d', category => line(this.data.filter(d => d.category === category)));

    container.append('g')
      .attr('class', 'horizontal-axis')
      .attr('transform', `translate(${this.config.verticalAxisSize}, ${height - (2 * this.config.padding) - this.config.horizontalAxisSize - this.config.legendSize})`)
      .call(labelAxis);

    container.append('g')
      .attr('class', 'vertical-axis')
      .attr('transform', `translate(${this.config.verticalAxisSize}, 0)`)
      .call(valueAxis);

    const legendItem = container.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(0, ${height - (2 * this.config.padding) - (this.config.legendSize / 2)})`)
      .selectAll('g')
      .data(categories)
      .enter()
      .append('g')
      .attr('transform', c => `translate(${legendScale(c)}, 0)`);

    legendItem.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', c => colorScale(c));

    legendItem.insert('text')
      .attr('dx', 20)
      .attr('dy', 15)
      .text(c => c)
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle');
  }
}
