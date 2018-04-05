import 'd3-selection-multi';
import { select, event } from 'd3-selection';
import { scalePow, scaleTime } from 'd3-scale';
import { max, extent, bisectLeft } from 'd3-array';
import { axisTop } from 'd3-axis';
import { drag as d3Drag } from 'd3-drag';
import { timeHour } from 'd3-time';
import throttle from 'lodash/throttle';

import AbstractVisualization from './AbstractVisualization';

class DayOnTheWeb extends AbstractVisualization {
  get days() {
    return [
      this.dictionary.monday,
      this.dictionary.tuesday,
      this.dictionary.wednesday,
      this.dictionary.thursday,
      this.dictionary.friday,
      this.dictionary.saturday,
      this.dictionary.sunday
    ];
  }

  constructor(el, config) {
    super(el, config);

    this.sample = 10000;

    this.sliderHeight = 180;
    this.sliderMargin = 40;
    this.sliderPadding = 90;
    this.sliderLabelMargin = 35;

    this.circleInnerPadding = 20; // Minimum space between the circles

    this.labelsMargin = 20; // Minimum space with the circles
    this.labelsAngle = -45;

    this.initialize();
    this.setListeners();
  }

  initialize() {
    // fetch and then render
    this.fetchData()
      .then(() => {
        // First monday of 1070
        // The year doesn't matter, we just want a Date object
        // so we can use a temporal scale
        const baseTimestamp = 345600000;

        this.data = this.data.map(d => ({
          category: d.category,
          date: new Date(baseTimestamp + (3600 * 1000 * (+d.hour))),
          duration: +d.duration,
          visits: +d.visits
        }));

        this.currentDate = this.data[0].date;
      })
      .then(() => this.render());
  }

  getTooltipContent(target) { // eslint-disable-line class-methods-use-this
    const d = select(target).datum();

    let dayIndex = this.currentDate.getUTCDay() - 1;
    if (dayIndex === -1) {
      dayIndex = 6;
    }

    const formatter = (v) => {
      const value = v / (60 * this.sample);
      return Math.floor(value) + (Math.round((value % 1) * 100) / 100);
    };

    const value = formatter(this.getCurrentValuePerCategory()[this.categories.indexOf(d.category)]);
    const average = formatter(d.value);

    return `
      <p class="title">${d.category}</p>
      <p class="note">${this.dictionary.browsingActivity}: ${value === 0 ? '< 0.01' : value} ${this.dictionary.min_pers_unit}</p>
      <p class="note">${this.dictionary.weekAverage}: ${average === 0 ? '< 0.01' : average} ${this.dictionary.min_pers_unit}</p>
      <p class="note">${this.days[dayIndex]}, ${this.currentDate.getUTCHours()}:00</p>
    `;
  }

  /**
   * Get the value of each category for the current date
   * @returns {number[]}
   */
  getCurrentValuePerCategory() {
    return this.categories.map(c => (
      this.data.find(d => d.category === c && +d.date === +this.currentDate).duration
    ));
  }

  /**
   * Update the visualisation according to the new
   * current date
   */
  update() {
    this.circles
      .data(this.getCurrentValuePerCategory())
      .attr('r', d => this.radiusScale(d))
      .attr('fill', this.color);

    this.handle
      .attr('transform', `translate(${this.timeScale(this.currentDate)}, 0)`)
      .select('text')
      .text(`${this.currentDate.getUTCHours()}:00`);
  }

  /**
   * Render the legend component
   */
  renderLegend() {
    const legendItem = this.container.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${this.legendBounds.x}, ${(this.visualizationBounds.y + this.visualizationBounds.height) - this.legendBounds.height})`)
      .selectAll('g')
      .data([
        this.dictionary.browsingActivity,
        this.dictionary.weekAverage
      ])
      .enter()
      .append('g');

    legendItem.append('circle')
      .attr('cx', 7.5)
      .attr('cy', 7.5)
      .attr('r', 7.5)
      .attr('fill', (_, i) => (i === 0 ? this.color : 'transparent'))
      .attr('stroke', (_, i) => (i === 0 ? 'transparent' : 'black'))
      .attr('stroke-width', (_, i) => (i === 0 ? 0 : 2))
      .attr('stroke-dasharray', '5 5');

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

  /**
   * Render the slider component
   */
  renderSlider() {
    const sliderContainer = this.container.append('g')
      .attr('class', 'slider')
      .attr('transform', `translate(${this.visualizationBounds.x}, ${this.legendBounds.y})`);

    sliderContainer.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '1em')
      .text(this.dictionary.dragDot);

    sliderContainer.append('rect')
      .attr('x', 7)
      .attr('y', this.sliderLabelMargin + 7)
      .attr('width', this.visualizationBounds.width - 7)
      .attr('height', this.sliderHeight - this.sliderLabelMargin - 7)
      .attr('fill', '#000');

    sliderContainer.append('rect')
      .attr('x', 3)
      .attr('y', this.sliderLabelMargin + 3)
      .attr('width', this.visualizationBounds.width - 7 - 6)
      .attr('height', this.sliderHeight - this.sliderLabelMargin - 7 - 6)
      .attr('fill', '#fff')
      .attr('stroke', '#000')
      .attr('stroke-width', 3);

    this.timeScale = scaleTime()
      .domain(extent(this.data, d => d.date))
      .range([0, this.visualizationBounds.width - 7 - 6 - (this.sliderPadding * 2)])
      .clamp(true);

    const timeAxis = axisTop(this.timeScale)
      .ticks(8)
      .tickSize(10)
      .tickPadding(0);

    const slider = sliderContainer.append('g')
      .attr('transform', `translate(${this.sliderPadding}, ${this.sliderLabelMargin + (((this.sliderHeight - this.sliderLabelMargin - 7 - 6) + 20) / 2)})`)
      .call(timeAxis);

    slider.selectAll('.tick text')
      .attr('transform', `translate(${-(this.timeScale.range()[1] / 7) / 2}, -20)`)
      .text((_, i) => this.days[i]);

    slider.selectAll('path, line')
      .attr('stroke-width', 3);

    // Handle
    const ticks = timeHour.range(...[
      this.timeScale.domain()[0],
      // The second value is exclusive, that's why we add another hour
      new Date(+this.timeScale.domain()[1] + (3600 * 1000))
    ]);
    const drag = d3Drag()
      .on('start drag', throttle(() => {
        this.currentDate = ticks[bisectLeft(ticks, this.timeScale.invert(event.x))];
        this.update();
      }), 16);

    this.handle = slider.append('g')
      .attr('class', 'handle')
      .attr('transform', `translate(${this.timeScale(this.currentDate)}, 0)`)
      .call(drag);

    this.handle.append('circle')
      .attr('r', 12)
      .attr('fill', '#fff')
      .attr('stroke', '#000')
      .attr('stroke-width', 3)
      .attr('cursor', 'pointer');

    this.handle.append('circle')
      .attr('r', 5)
      .attr('fill', '#000')
      .attr('cursor', 'pointer');

    this.handle.append('text')
      .attr('transform', 'translate(0, 30)')
      .attr('dominant-baseline', 'central')
      .attr('text-anchor', 'middle')
      .text(`${this.currentDate.getUTCHours()}:00`);
  }

  /**
   * Render the circles
   */
  renderMarks() {
    const marksContainer = this.container.append('g')
      .attr('class', 'marks')
      .attr('transform', `translate(${this.visualizationBounds.x}, ${this.legendBounds.y + this.sliderHeight + this.sliderMargin})`);

    // Maximum size of the circles
    const maxRadius = (this.visualizationBounds.width -
      ((this.categories.length - 1) * this.circleInnerPadding))
      / (this.categories.length * 2);

    this.radiusScale = scalePow()
      .exponent(0.5)
      .domain([0, max(this.data, d => d.duration)])
      .range([
        1,
        Math.min(this.visualizationBounds.height - this.sliderHeight - this.sliderMargin, maxRadius)
      ]);

    // Circles representing the current date
    let position = -this.circleInnerPadding - maxRadius;
    this.circles = marksContainer.append('g')
      .attr('class', 'current')
      .selectAll('circle')
      .data(this.getCurrentValuePerCategory())
      .enter()
      .append('circle')
      .attr('cx', () => {
        position += (2 * maxRadius) + this.circleInnerPadding;
        return position;
      })
      .attr('cy', this.radiusScale.range()[1])
      .attr('r', d => this.radiusScale(d))
      .attr('fill', this.color);

    // Average duration per category
    const averagePerCategory = this.categories.map((c) => {
      const data = this.data.filter(d => d.category === c);
      return {
        category: c,
        value: data.reduce((res, d) => res + d.duration, 0) / data.length
      };
    });

    // Circles representing the average by category
    position = -this.circleInnerPadding - maxRadius;
    marksContainer.append('g')
      .attr('class', 'average')
      .selectAll('circle')
      .data(averagePerCategory)
      .enter()
      .append('circle')
      .attr('cx', () => {
        position += (2 * maxRadius) + this.circleInnerPadding;
        return position;
      })
      .attr('cy', this.radiusScale.range()[1])
      .attr('r', d => this.radiusScale(d.value))
      .attr('fill', 'transparent')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5 5')
      .attr('title', d => d);
  }

  /**
   * Render the labels below the circles
   */
  renderLabels() {
    // Maximum size of the circles
    const maxRadius = (this.visualizationBounds.width -
      ((this.categories.length - 1) * this.circleInnerPadding))
      / (this.categories.length * 2);

    const labelsContainer = this.container.append('g')
      .attr('class', 'labels')
      .attr('transform', `translate(${this.visualizationBounds.x}, ${this.legendBounds.y + this.sliderHeight + this.sliderMargin + (2 * maxRadius) + this.labelsMargin})`);

    // Circles representing the current date
    labelsContainer.selectAll('text')
      .data(this.categories)
      .enter()
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text(d => d);

    const self = this;
    let position = -this.circleInnerPadding - maxRadius;
    labelsContainer.selectAll('text')
      .attr('transform', function () { // eslint-disable-line func-names
        position += (2 * maxRadius) + self.circleInnerPadding;
        const offset = (this.getComputedTextLength() / 2)
          * Math.abs(Math.sin(self.labelsAngle * (Math.PI / 180)));
        return `translate(${position}, ${offset}) rotate(${self.labelsAngle})`;
      });
  }

  render() {
    super.render();
    if (!this.data) return;

    this.el.classList.add('v-day-on-the-web');

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

    this.categories = this.data.map(d => d.category)
      .filter((d, i, arr) => arr.indexOf(d) === i);

    this.container = this.svg.append('g')
      .attr('transform', `translate(${this.padding}, ${this.padding})`);

    // Title
    // NOTE: the title of the visualisations is now
    // displayed in the Wysiwyg
    // this.container.append('g')
    //   .attr('class', 'title')
    //   .attr('transform', `translate(${this.titleBounds.x}, ${this.titleBounds.y})`)
    //   .append('text')
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('dominant-baseline', 'hanging')
    //   .text(this.title);

    // Legend
    // NOTE: the legend is at the bottom of the visualisation
    this.renderLegend();

    // Slider
    this.renderSlider();

    // Marks
    this.renderMarks();

    // Labels
    this.renderLabels();

    this.instantiateTooltip('circle');
  }
}

export default DayOnTheWeb;
