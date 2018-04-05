import { select } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { extent } from 'd3-array';
import { areaRadial } from 'd3-shape';
import scaleRadial from 'components/Visualizations/helpers/scale-radial';
import AbstractVisualization from 'components/Visualizations/AbstractVisualization';

export default class AppUnhappiness extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    this.initialize();
    this.setListeners()
  }

  initialize() {
    // fetch and then render
    this.fetchData()
      .then(() => {
        this.data = this.data.map(d => Object.assign({}, d, {
          value: +d.value
        }));
      })
      .then(() => this.render());
  }

  getTooltipContent(target) { // eslint-disable-line class-methods-use-this
    const label = select(target).datum();
    const data = this.data.filter(d => d.label === label);

    const formatPercentage = (v) => {
      const value = v * 100;
      return `${Math.floor(value) + (Math.round((value % 1) * 100) / 100)}%`;
    };

    return `
      <div class="app-unhappiness">
        <div class="title">${label}</div>
        <div class="container">
          <div>
            <div class="label">${data[0].category}</div>
            <div class="number">${formatPercentage(data[0].value)}</div>
          </div>
          <div>
            <div class="label">${this.dictionary.minutes_on_screen}</div>
            <div class="note">
              <svg class="c-icon -x-small"><use xlink:href="#icon-happy-big-reaction"></use></svg>
              ${data[1].value}
            </div>
            <div class="note">
              <svg class="c-icon -x-small"><use xlink:href="#icon-sad-big-reaction"></use></svg>
              ${data[2].value}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    super.render();
    if (!this.data) return;

    this.el.classList.add('v-app-unhappiness');

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

    const categories = this.data.map(d => d.category)
      .filter((d, i, arr) => arr.indexOf(d) === i);

    const labels = this.data
      .filter(d => d.category === categories[0])
      .sort((a, b) => a.value - b.value)
      .map(d => d.label);

    const maxRadius = (this.visualizationBounds.height / 2) - 160;

    const radiusScale = scaleLinear()
      .domain([0, 100])
      .range([0, maxRadius]);

    const labelScale = scaleLinear()
      .domain([0, (this.data.length / 3) - 1])
      .range([0, 2 * Math.PI]);

    const categoryFillScale = scaleOrdinal()
      .domain(categories)
      .range(['transparent', this.color, 'rgba(0, 0, 0, .2)']);

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
    if (this.legend) {
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
    }

    // Marks
    const markContainer = container.append('g')
      .attr('class', 'marks')
      .attr('transform', `translate(${this.visualizationBounds.x + (this.visualizationBounds.width / 2)}, ${this.visualizationBounds.y + (this.visualizationBounds.height / 2)})`);

    markContainer
      .selectAll('path')
      .data(categories.slice(1, categories.length).concat([categories[0]]))
      .enter()
      .append('path')
      .attr('d', (c, i) => {
        const data = this.data.filter(d => d.category === c)
          .sort((a, b) => labels.indexOf(b.label) - labels.indexOf(a.label));

        const areaScale = scaleRadial()
          .domain(i === categories.length - 1
            ? [0, 1]
            : extent(
              this.data.filter(d => d.category !== categories[0])
                .map(d => d.value)
            )
          )
          .range([0, maxRadius]);

        const area = areaRadial()
          .angle((_, index) => labelScale(index))
          .innerRadius(0)
          .outerRadius(d => (c === categories[0]
            ? radiusScale(d.value * 100)
            : areaScale(d.value)));

        return area(data);
      })
      .attr('fill', c => categoryFillScale(c))
      .attr('stroke', (_, i) => (i === categories.length - 1 ? '#000' : 'transparent'))
      .attr('stroke-width', (_, i) => (i === categories.length - 1 ? 2 : 0));

    // Radial Axis
    container.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${this.visualizationBounds.x + (this.visualizationBounds.width / 2)}, ${this.visualizationBounds.y + (this.visualizationBounds.height / 2)})`)
      .selectAll('text')
      .data(radiusScale.ticks(5))
      .enter()
      .append('text')
      .attr('x', 5)
      .attr('y', d => -radiusScale(d))
      .text(d => d);

    // Circles
    container.append('g')
      .attr('class', 'rules')
      .attr('transform', `translate(${this.visualizationBounds.x + (this.visualizationBounds.width / 2)}, ${this.visualizationBounds.y + (this.visualizationBounds.height / 2)})`)
      .selectAll('circle')
      .data(radiusScale.ticks(5))
      .enter()
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', d => radiusScale(d));

    // Labels
    const getAngle = i => -90 + ((i / labels.length) * 360);
    container.append('g')
      .attr('class', 'labels')
      .attr('transform', `translate(${this.visualizationBounds.x + (this.visualizationBounds.width / 2)}, ${this.visualizationBounds.y + (this.visualizationBounds.height / 2)})`)
      .selectAll('g')
      .data(labels.reverse())
      .enter()
      .append('g')
      .attr('transform', (_, i) => `rotate(${getAngle(i)})`)
      .append('g')
      .attr('transform', (_, i) => (getAngle(i) >= 90 ? `rotate(180 ${maxRadius + 20}, 0)` : null))
      .append('text')
      .attr('x', maxRadius + 20)
      .attr('y', (_, i) => (getAngle(i) >= 90 ? -12 : 12))
      .style('text-anchor', (_, i) => (getAngle(i) >= 90 ? 'end' : 'start'))
      .text(d => d)
      .attr('title', d => d);

    this.instantiateTooltip('.labels text');
  }
}
