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
    this.config.axisSize = this.config.direction === 'horizontal' ? 70 : 20;

    this.initialize();
  }

  initialize() {
    this.fetchData()
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
      .rangeRound([0, (this.config.direction === 'horizontal' ? height : width) - (2 * this.config.padding)])
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
      .rangeRound(this.config.direction === 'horizontal' ? [0, width - (2 * this.config.padding) - this.config.axisSize] : [height - (2 * this.config.padding) - this.config.axisSize, 0]);

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
      .attr('transform', d => (this.config.direction === 'horizontal' ? `translate(0, ${labelScale(d)})` : `translate(${labelScale(d)}, 0)`))
      .selectAll('rect')
      .data(label => this.data.filter(d => d.label === label))
      .enter()
      .append('rect')
      .attr(this.config.direction === 'horizontal' ? 'y' : 'x', d => categoryScale(d.category))
      .attr(this.config.direction === 'horizontal' ? 'x' : 'y', d => (this.config.direction === 'horizontal' ? this.config.axisSize : valueScale(d.value)))
      .attr(this.config.direction === 'horizontal' ? 'height' : 'width', categoryScale.bandwidth())
      .attr(this.config.direction === 'horizontal' ? 'width' : 'height', d => (this.config.direction === 'horizontal' ? valueScale(d.value) : (height - (2 * this.config.padding) - this.config.axisSize - valueScale(d.value))))
      .attr('fill', d => categoryFillScale(d.category))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    container.append('g')
      .attr('class', 'axis')
      .attr('transform', this.config.direction === 'horizontal' ? `translate(${this.config.axisSize}, 0)` : `translate(0, ${height - (2 * this.config.padding) - this.config.axisSize})`)
      .call(labelAxis);
  }
}
