import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';

import AbstractVisualization from 'components/Visualizations/AbstractVisualization';

export default class Circle extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    this.initialize();
    this.setListeners();
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
    const firstLineRemainingSpace = width - firstLineCirclesSize.reduce((res, s) => res + s, 0);

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

    this.el.classList.add('v-circle');

    // We remove the space reserved for the axes
    this.config.valueAxisSize = 0;
    this.config.labelAxisSize = 0;

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

    const container = this.svg.append('g')
      .attr('transform', `translate(${this.padding}, ${this.padding})`);

    // Title
    // NOTE: the title of the visualisations is now
    // displayed in the Wysiwyg
    // container.append('g')
    //   .attr('class', 'title')
    //   .attr('transform', `translate(${this.titleBounds.x}, ${this.titleBounds.y})`)
    //   .append('text')
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('dominant-baseline', 'hanging')
    //   .text(this.title);

    // Legend
    const legendItem = container.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${this.legendBounds.x}, ${this.legendBounds.y})`)
      .selectAll('g')
      .data(categories)
      .enter()
      .append('g');

    legendItem.append('circle')
      .attr('cx', 7.5)
      .attr('cy', 7.5)
      .attr('r', 7.5)
      .attr('fill', (_, i) => (i === 0 ? '#64A4F4' : 'transparent'))
      .attr('stroke', (_, i) => (i === 0 ? 'transparent' : 'black'))
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5, 3');

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

    // Marks
    const valueScale = scaleLinear()
      .domain(extent(this.data, d => d.value))
      .range([5, 150]);

    const xOffset = 20;

    const firstLineLabelScale = this.getLabelScale(
      labels.slice(0, Math.min(labels.length, 6)),
      valueScale,
      this.visualizationBounds.width - xOffset
    );
    const secondLineLabelScale = this.getLabelScale(
      labels.slice(6, labels.length),
      valueScale,
      this.visualizationBounds.width - xOffset
    );

    const firstLineItem = container.append('g')
      .attr('class', 'marks')
      .attr('transform', `translate(${this.visualizationBounds.x + xOffset}, ${this.visualizationBounds.y + valueScale.range()[1]})`)
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
      .attr('dominant-baseline', 'central')
      .attr('transform', (_, i) => (i < 3 ? '' : `translate(${firstLineLabelScale(i)}, ${secondLineLabelScale(0) + 60}) rotate(-45)`));

    const secondLineItem = container.append('g')
      .attr('class', 'second-line')
      .attr('transform', `translate(${this.visualizationBounds.x + xOffset}, ${this.visualizationBounds.y + (valueScale.range()[1] * 2) + secondLineLabelScale(0) + 60})`)
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
      .attr('dominant-baseline', 'central')
      .attr('transform', (_, i) => `translate(${secondLineLabelScale(i)}, ${secondLineLabelScale(0) + 60}) rotate(-45)`);
  }
}
