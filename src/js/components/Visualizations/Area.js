import { select } from 'd3-selection';
import { scaleUtc, scaleLinear, scaleOrdinal } from 'd3-scale';
import { max, extent } from 'd3-array';
import { axisRight, axisBottom } from 'd3-axis';
import { area as d3Area, line as d3Line } from 'd3-shape';

import AbstractVisualization from 'components/Visualizations/AbstractVisualization';

export default class Area extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    this.initialize();
    this.setListeners();
  }

  initialize() {
    this.fetchData()
      .then(() => {
        // We properly format the labels as dates and
        // the values as numbers
        this.data = this.data.map(d => Object.assign(d, {
          // If d.label is a number like "2010", then the date
          // parser will fail
          label: new Date(`${d.label}`),
          value: +d.value
        }));
      })
      .catch(() => {})
      .then(() => this.render());
  }

  render() {
    super.render();
    if (!this.data) return;

    this.svg = select(this.el).append('svg')
      .attr('width', this.width * this.scale)
      .attr('height', this.height * this.scale)
      .attr('role', 'img')
      .attr('aria-labelledby', `title_${this.id} desc_${this.id}`)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);

    this.svg.append('title')
      .attr('id', `title_${this.id}`)
      .text(this.title);

    this.svg.append('desc')
      .attr('id', `desc_${this.id}`)
      .text(this.description);

    const labels = this.data.map(d => d.label)
      .filter((d, i, arr) => arr.indexOf(d) === i);

    const categories = this.data.map(d => d.category)
      .filter((d, i, arr) => arr.indexOf(d) === i);

    const patterns = this.patterns;
    patterns.forEach(p => this.svg.call(p));

    const categoryFillScale = scaleOrdinal()
      .domain(categories)
      .range(patterns.map(p => p.url()));

    const container = this.svg.append('g')
      .attr('transform', `translate(${this.padding}, ${this.padding})`);

    // Title
    container.append('g')
      .attr('class', 'title')
      .attr('transform', `translate(${this.titleBounds.x}, ${this.titleBounds.y})`)
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dominant-baseline', 'hanging')
      .text(this.title);

    // Legend
    const legendItem = container.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${this.legendBounds.x}, ${this.legendBounds.y})`)
      .selectAll('g')
      .data(categories)
      .enter()
      .append('g');

    legendItem.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', c => categoryFillScale(c))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    legendItem.insert('text')
      .attr('x', 25)
      .attr('y', 7.5)
      .text(c => c)
      .attr('text-anchor', 'left')
      .attr('dominant-baseline', 'central');

    // We position the items as if they would
    // follow the "inline" flow
    this.config.legendRows = 1;
    let currentXPosition = this.legendBounds.x;
    let currentRow = 0;
    const self = this;
    legendItem
      .attr('transform', function () { // eslint-disable-line func-names
        const width = this.getBBox().width + 40;
        const nextXPosition = currentXPosition + width;
        if (nextXPosition > self.titleBounds.width) {
          currentRow++; // eslint-disable-line no-plusplus
          currentXPosition = self.legendBounds.x;
        }
        const res = `translate(${currentXPosition}, ${currentRow * (self.legendBounds.height)})`;
        currentXPosition += width;
        return res;
      });

    this.config.legendRows = currentRow + 1;

    // Value axis title
    container.append('g')
      .attr('class', 'value-axis-title')
      .attr('transform', () => {
        const translate = `translate(${this.valueAxisTitleBounds.x + (this.valueAxisTitleBounds.width / 2)}, ${this.valueAxisTitleBounds.y + (this.valueAxisTitleBounds.height / 2)})`;
        if (this.direction === 'horizontal') {
          return translate;
        }
        return `${translate} rotate(-90)`;
      })
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dominant-baseline', 'central')
      .attr('text-anchor', 'middle')
      .text(this.valueAxisTitle);

    // Label axis title
    container.append('g')
      .attr('class', 'label-axis-title')
      .attr('transform', () => {
        const translate = `translate(${this.labelAxisTitleBounds.x + (this.labelAxisTitleBounds.width / 2)}, ${this.labelAxisTitleBounds.y + (this.labelAxisTitleBounds.height / 2)})`;
        if (this.direction === 'horizontal') {
          return `${translate} rotate(-90)`;
        }
        return translate;
      })
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dominant-baseline', 'central')
      .attr('text-anchor', 'middle')
      .text(this.labelAxisTitle);

    // Value axis
    const valueScale = scaleLinear()
      .domain([0, max(this.data, d => d.value)])
      .rangeRound([this.valueAxisBounds.height, 0]);

    const valueAxis = axisRight(valueScale)
      .tickPadding(10)
      .tickSize(0)
      .tickFormat(this.valueFormat);

    container.append('g')
      .attr('class', 'value-axis')
      .attr('transform', `translate(${this.valueAxisBounds.x}, ${this.valueAxisBounds.y})`)
      .call(valueAxis.ticks(this.valueAxisTicks))
      .selectAll('text');

    // Label axis
    const labelScale = scaleUtc()
      .domain(extent(labels))
      .rangeRound(this.direction === 'horizontal' ? [0, this.visualizationBounds.height] : [0, this.visualizationBounds.width]);

    const labelAxis = axisBottom(labelScale)
      .tickPadding(10)
      .tickSize(0);

    labelAxis.tickFormat(this.labelFormat);

    container.append('g')
      .attr('class', 'label-axis')
      .attr('transform', `translate(${this.labelAxisBounds.x}, ${this.labelAxisBounds.y})`)
      .call(labelAxis)
      .selectAll('text')
      .attr('text-anchor', (_, i) => {
        if (i === 0) return 'start';
        if (i === labelScale.ticks().length - 1) return 'end';
        return 'middle';
      });

    // Rules
    container.append('g')
      .attr('class', 'rules -secondary')
      .attr('transform', `translate(0, ${this.valueAxisBounds.y})`)
      .selectAll('line')
      .data(labelScale.ticks())
      .enter()
      .append('line')
      .attr('x1', d => labelScale(d))
      .attr('x2', d => labelScale(d))
      .attr('y1', 0)
      .attr('y2', this.visualizationBounds.height);

    container.append('g')
      .attr('class', 'rules')
      .attr('transform', `translate(0, ${this.valueAxisBounds.y})`)
      .selectAll('line')
      .data(valueScale.ticks(this.valueAxisTicks))
      .enter()
      .append('line')
      .attr('x1', this.visualizationBounds.x)
      .attr('x2', this.valueAxisBounds.x + this.valueAxisBounds.width)
      .attr('y1', d => valueScale(d))
      .attr('y2', d => valueScale(d));

    // Marks
    const area = d3Area()
      .x(d => labelScale(d.label))
      .y0(valueScale(0))
      .y1(d => valueScale(d.value));

    const line = d3Line()
      .x(d => labelScale(d.label))
      .y(d => valueScale(d.value));

    container.append('g')
      .attr('class', 'marks')
      .attr('transform', `translate(${this.visualizationBounds.x}, ${this.visualizationBounds.y})`)
      .selectAll('path')
      .data(categories)
      .enter()
      .append('path')
      .attr('fill', c => categoryFillScale(c))
      .attr('d', category => area(this.data.filter(d => d.category === category)));

    container.append('g')
      .attr('class', 'marks')
      .attr('transform', `translate(${this.visualizationBounds.x}, ${this.visualizationBounds.y})`)
      .selectAll('path')
      .data(categories)
      .enter()
      .append('path')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'transparent')
      .attr('d', category => line(this.data.filter(d => d.category === category)));
  }
}
