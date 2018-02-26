import textures from 'textures';
import { select } from 'd3-selection';
import { scaleUtc, scaleLinear, scaleOrdinal, scaleBand } from 'd3-scale';
import { max, extent } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { area as d3Area, line as d3Line, curveLinear } from 'd3-shape';

import AbstractVisualization from 'components/Visualizations/AbstractVisualization';

export default class Area extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);

    this.config = config;
    this.config.height = 600;
    this.config.padding = 20;
    this.config.horizontalAxisSize = this.config.horizontalAxisSize || 20;
    this.config.verticalAxisSize = this.config.verticalAxisSize || 70;
    this.config.legendSize = 50;
    this.config.curve = this.config.curve || curveLinear;
    this.config.colorScale = this.config.colorScale || ['#FFE159'];
    this.config.patterns = this.config.patterns || [
      textures.circles()
        .complement()
        .lighter()
        .strokeWidth(0)
        .size(10)
    ];

    this.initialize();
  }

  initialize() {
    this.fetchData()
      .then(() => {
        // We properly format the labels as dates and
        // the values as numbers
        this.data = this.data.map(d => Object.assign(d, {
          label: new Date(d.label),
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

    const colorScale = scaleOrdinal(this.config.colorScale)
      .domain(categories);

    // We add the background to the pattern
    this.config.patterns = this.config.patterns.slice(0)
      .map((p, i) => p.background(colorScale(categories[i])));

    // We save the patterns in the SVG element
    this.config.patterns.forEach(p => svg.call(p));

    const patternScale = scaleOrdinal()
      .domain(categories)
      .range(this.config.patterns.map(p => p.url()));


    const labelAxis = axisBottom(labelScale)
      .tickPadding(10)
      .tickSize(0);

    const valueAxis = axisLeft(valueScale)
      .tickPadding(10)
      .tickSize(0);

    const area = d3Area()
      .x(d => labelScale(d.label))
      .y0(valueScale(0))
      .y1(d => valueScale(d.value))
      .curve(this.config.curve);

    const line = d3Line()
      .x(d => labelScale(d.label))
      .y(d => valueScale(d.value))
      .curve(this.config.curve);

    const container = svg.append('g')
      .attr('transform', `translate(${this.config.padding}, ${this.config.padding})`);

    container.append('g')
      .attr('class', 'areas')
      .attr('transform', `translate(${this.config.verticalAxisSize}, 0)`)
      .selectAll('path')
      .data(categories)
      .enter()
      .append('path')
      .attr('fill', c => patternScale(c))
      .attr('d', category => area(this.data.filter(d => d.category === category)));

    container.append('g')
      .attr('class', 'lines')
      .attr('transform', `translate(${this.config.verticalAxisSize}, 0)`)
      .selectAll('path')
      .data(categories)
      .enter()
      .append('path')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
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
      .attr('fill', c => patternScale(c));

    legendItem.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 3)
      .attr('strokeWidth', 3)
      .attr('stroke', 'black');

    legendItem.insert('text')
      .attr('dx', 20)
      .attr('dy', 15)
      .text(c => c)
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle');
  }
}
