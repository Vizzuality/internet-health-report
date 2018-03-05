import textures from 'textures';
import { select } from 'd3-selection';
import { scaleBand, scaleOrdinal, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';

import AbstractVisualization from 'components/Visualizations/AbstractVisualization';

export default class Bar extends AbstractVisualization {
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
        this.data = this.data.map(d => Object.assign({}, d, {
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

    const categoryScale = scaleBand()
      .domain(categories)
      .rangeRound([0, labelScale.bandwidth()])
      .paddingInner(0.1);

    const categoryFillScale = scaleOrdinal()
      .domain(categories)
      .range(patterns.map(p => p.url()));

    const valueScale = scaleLinear()
      .domain([0, max(this.data, d => d.value)])
      .rangeRound(this.config.direction === 'horizontal' ? [0, width - (2 * this.config.padding) - this.config.labelAxisSize] : [height - this.config.legendSize - (2 * this.config.padding) - this.config.labelAxisSize, 0]);

    const legendScale = scaleBand()
      .domain(categories)
      .rangeRound([0, width - (2 * this.config.padding)]);

    const valueAxis = (this.config.direction === 'horizontal' ? axisBottom : axisLeft)(valueScale)
      .tickPadding(10)
      .tickSize(5);

    const labelAxis = (this.config.direction === 'horizontal' ? axisLeft : axisBottom)(labelScale)
      .tickPadding(10)
      .tickSize(0);

    const container = svg.append('g')
      .attr('transform', `translate(${this.config.padding}, ${this.config.padding})`);

    container.append('g')
      .selectAll('g')
      .data(labels)
      .enter()
      .append('g')
      .attr('transform', (d) => {
        if (this.config.direction === 'horizontal') {
          return `translate(0, ${labelScale(d)})`;
        }
        return `translate(${labelScale(d)}, 0)`;
      })
      .selectAll('rect')
      .data(label => this.data.filter(d => d.label === label))
      .enter()
      .append('rect')
      .attr('x', (d) => {
        if (this.config.direction === 'horizontal') {
          return this.config.labelAxisSize;
        }
        return categoryScale(d.category) + this.config.valueAxisSize;
      })
      .attr('y', (d) => {
        if (this.config.direction === 'horizontal') {
          return categoryScale(d.category);
        }
        return valueScale(d.value);
      })
      .attr('width', (d) => {
        if (this.config.direction === 'horizontal') {
          return valueScale(d.value);
        }
        return categoryScale.bandwidth();
      })
      .attr('height', (d) => {
        if (this.config.direction === 'horizontal') {
          return categoryScale.bandwidth();
        }
        return height - (2 * this.config.padding) - this.config.labelAxisSize - valueScale(d.value) - this.config.legendSize;
      })
      .attr('fill', d => categoryFillScale(d.category))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    container.append('g')
      .attr('class', 'label-axis')
      .attr('transform', () => {
        if (this.config.direction === 'horizontal') {
          return `translate(${this.config.labelAxisSize}, 0)`;
        }
        return `translate(${this.config.valueAxisSize}, ${height - (2 * this.config.padding) - this.config.labelAxisSize - this.config.legendSize})`;
      })
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
