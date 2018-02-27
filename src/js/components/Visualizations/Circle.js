import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';

import AbstractVisualization from 'components/Visualizations/AbstractVisualization';

export default class Circle extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);

    this.config = config;
    this.config.height = 600;
    this.config.padding = 20;
    this.config.legendSize = 50;

    this.initialize();
  }

  initialize() {
    this.fetchData()
      .then(() => {
        this.data = this.data.map(d => Object.assign(d, { value: +d.value }));
      })
      .catch(() => {})
      .then(() => this.render());
  }

  /**
   * Return a pseudo scale based on the index number
   * that returns the position of the circles center for that
   * index
   * @param {string[]} labels Labels to take into account
   * @param {function(number): number} valueScale Scale for the radius of the circles
   * @param {number} width Available space for the circles
   * @returns {function(number): number}
   */
  getLabelScale(labels, valueScale, width) {
    // Space needed for each pair of circles of the first line
    const firstLineCirclesSize = labels.slice(0, labels.length)
      .map((label) => {
        // We get the two circles with the label
        const circles = this.data.filter(d => d.label === label);

        // We return the circle whose value is bigger
        if (circles.length > 1 && circles[1].value > circles[0].value) {
          return circles[1];
        }

        return circles[0];
      })
      .map(d => valueScale(d.value) * 2);

    // // Remaining space between the pair of circles of the first line
    const firstLineRemainingSpace = (width - (2 * this.config.padding)
      - firstLineCirclesSize.reduce((res, s) => res + s, 0));

    const firstLineLabelRange = (new Array(labels.length)).fill(undefined)
      .map((_, i) => {
        let offset = 0;
        if (i > 0) {
          offset = firstLineCirclesSize.slice(0, i)
            .reduce((res, d) => res + d, 0);

          offset += (firstLineRemainingSpace / labels.length) * i;
        }

        const radius = firstLineCirclesSize[i] / 2;

        return Math.floor(radius + offset);
      });

    return i => firstLineLabelRange[i];
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

    const valueScale = scaleLinear()
      .domain(extent(this.data, d => d.value))
      .range([5, 160]);

    const firstLineLabelScale = this.getLabelScale(
      labels.slice(0, Math.min(labels.length, 6)),
      valueScale,
      width
    );
    const secondLineLabelScale = this.getLabelScale(
      labels.slice(6, labels.length),
      valueScale,
      width
    );

    const container = svg.append('g')
      .attr('transform', `translate(${this.config.padding}, ${this.config.padding})`);

    const firstLineItem = container.append('g')
      .attr('class', 'first-line')
      .attr('transform', `translate(0, ${valueScale.range()[1] + this.config.legendSize})`)
      .selectAll('g')
      .data(labels.slice(0, 6))
      .enter()
      .append('g');

    firstLineItem
      .append('circle')
      .attr('cx', (_, i) => firstLineLabelScale(i))
      .attr('cy', 0)
      .attr('r', label => valueScale(this.data.filter(d => d.label === label)[0].value))
      .attr('fill', '#64A4F4');

    firstLineItem
      .append('circle')
      .attr('cx', (_, i) => firstLineLabelScale(i))
      .attr('cy', 0)
      .attr('r', label => valueScale(this.data.filter(d => d.label === label)[1].value))
      .attr('fill', 'transparent')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5, 3');

    firstLineItem.insert('text')
      .attr('dx', (_, i) => (i < 3 ? firstLineLabelScale(i) : 0))
      .attr('dy', 0)
      .text(l => l)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('transform', (_, i) => (i < 3 ? '' : `translate(${firstLineLabelScale(i)}, ${secondLineLabelScale(0) + 60}) rotate(-45)`));

    const secondLineItem = container.append('g')
      .attr('class', 'second-line')
      .attr('transform', `translate(0, ${(valueScale.range()[1] * 2) + secondLineLabelScale(0) + this.config.legendSize + 60})`)
      .selectAll('g')
      .data(labels.slice(6, labels.length))
      .enter()
      .append('g');

    secondLineItem
      .append('circle')
      .attr('cx', (_, i) => secondLineLabelScale(i))
      .attr('cy', 0)
      .attr('r', label => valueScale(this.data.filter(d => d.label === label)[0].value))
      .attr('fill', '#64A4F4');

    secondLineItem
      .append('circle')
      .attr('cx', (_, i) => secondLineLabelScale(i))
      .attr('cy', 0)
      .attr('r', label => valueScale(this.data.filter(d => d.label === label)[1].value))
      .attr('fill', 'transparent')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5, 3');

    secondLineItem.insert('text')
      .attr('dx', 0)
      .attr('dy', 0)
      .text(l => l)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('transform', (_, i) => `translate(${secondLineLabelScale(i)}, ${secondLineLabelScale(0) + 60}) rotate(-45)`);

    const legendItem = container.append('g')
      .attr('class', 'legend')
      .selectAll('g')
      .data(categories)
      .enter()
      .append('g')
      .attr('transform', (_, i) => `translate(${i * 150}, 0)`);

    legendItem.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 7.5)
      .attr('fill', (_, i) => (i === 0 ? '#64A4F4' : 'transparent'))
      .attr('stroke', (_, i) => (i === 0 ? 'transparent' : 'black'))
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5, 3');

    legendItem.insert('text')
      .attr('dx', 20)
      .attr('dy', 7.5)
      .text(c => c)
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle');
  }
}
