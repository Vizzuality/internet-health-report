import textures from 'textures';
import { select } from 'd3-selection';
import { scaleBand, scaleOrdinal, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { stack as d3Stack } from 'd3-shape';

import AbstractVisualization from 'components/Visualizations/AbstractVisualization';

export default class StackedBar extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);

    this.config = config;
    this.config.height = 600;
    this.config.padding = 20;
    this.config.direction = this.config.direction || 'vertical';
    this.config.labelAxisSize = this.config.labelAxisSize || this.config.direction === 'horizontal' ? 70 : 20;
    this.config.valueAxisSize = this.config.valueAxisSize || this.config.direction === 'horizontal' ? 20 : 70;
    this.config.legendSize = 50;

    this.initialize();
  }

  initialize() {
    this.fetchData()
      .then(() => {
        const labels = this.data.map(d => d.label)
          .filter((d, i, arr) => arr.indexOf(d) === i);

        // We transform the data to it has this structure:
        // { label: 'label_value', [category_1]: 'value', [category_2]: 'value', ... }[]
        this.data = labels.map((label) => {
          const rows = this.data.filter(d => d.label === label);
          return rows.map(r => ({ [r.category]: +r.value }))
            .reduce((res, o) => Object.assign(res, o), { label });
        });
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

    const categories = Object.keys(this.data[0])
      .filter(k => k !== 'label');

    const patterns = [
      textures.lines().lighter().size(8),
      textures.paths().d('woven').lighter().size(8),
      textures.circles().lighter().size(8)
    ];

    patterns.forEach(p => svg.call(p));

    const labelScale = scaleBand()
      .domain(labels)
      .rangeRound([0, (this.config.direction === 'horizontal' ? (height - this.config.legendSize) : width) - (2 * this.config.padding) - this.config.valueAxisSize])
      .paddingInner(0.2);

    const categoryFillScale = scaleOrdinal()
      .domain(categories)
      .range(patterns.map(p => p.url()));

    const valueScale = scaleLinear()
      .domain([0, max(this.data, d => categories.map(c => d[c]).reduce((res, v) => res + v, 0))])
      .rangeRound(this.config.direction === 'horizontal' ? [0, width - (2 * this.config.padding) - this.config.labelAxisSize] : [height - (2 * this.config.padding) - this.config.labelAxisSize - this.config.legendSize, 0]);

    const legendScale = scaleBand()
      .domain(categories)
      .rangeRound([0, width - (2 * this.config.padding)]);

    const labelAxis = (this.config.direction === 'horizontal' ? axisLeft : axisBottom)(labelScale)
      .tickPadding(10)
      .tickSize(0);

    const valueAxis = (this.config.direction === 'horizontal' ? axisBottom : axisLeft)(valueScale)
      .tickPadding(10)
      .tickSize(5);

    const stack = d3Stack()
      .keys(categories);
    const stackedData = stack(this.data);

    const container = svg.append('g')
      .attr('transform', `translate(${this.config.padding}, ${this.config.padding})`);

    container
      .selectAll('g')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', d => categoryFillScale(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', (d) => {
        if (this.config.direction === 'horizontal') {
          return valueScale(d[0]) + this.config.labelAxisSize;
        }
        return labelScale(d.data.label) + this.config.valueAxisSize;
      })
      .attr('y', (d) => {
        if (this.config.direction === 'horizontal') {
          return labelScale(d.data.label);
        }
        return valueScale(d[1]);
      })
      .attr('height', (d) => {
        if (this.config.direction === 'horizontal') {
          return labelScale.bandwidth();
        }
        return valueScale(d[0]) - valueScale(d[1]);
      })
      .attr('width', (d) => {
        if (this.config.direction === 'horizontal') {
          return valueScale(d[1]) - valueScale(d[0]);
        }
        return labelScale.bandwidth();
      })
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    container.append('g')
      .attr('class', 'label-axis')
      .attr('transform', this.config.direction === 'horizontal' ? `translate(${this.config.labelAxisSize}, 0)` : `translate(${this.config.valueAxisSize}, ${height - (2 * this.config.padding) - this.config.labelAxisSize - this.config.legendSize})`)
      .call(labelAxis);

    container.append('g')
      .attr('class', 'value-axis')
      .attr('transform', this.config.direction === 'horizontal' ? `translate(${this.config.labelAxisSize}, ${height - (2 * this.config.padding) - this.config.valueAxisSize - this.config.legendSize})` : `translate(${this.config.valueAxisSize}, 0)`)
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
      .attr('fill', c => categoryFillScale(c))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    legendItem.insert('text')
      .attr('dx', 20)
      .attr('dy', 15)
      .text(c => c)
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle');
  }
}
