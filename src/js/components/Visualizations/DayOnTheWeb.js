import 'd3-selection-multi';
import { select, event } from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { max, extent } from 'd3-array';
import { axisTop } from 'd3-axis';
import { timer } from 'd3-timer';
import { easeCircle } from 'd3-ease';
import { drag } from 'd3-drag';
import { timeDay } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import AbstractVisualization from './AbstractVisualization';

class DayOnTheWeb extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    this.moveTween = this.moveTween.bind(this);
    this.sliderHeight = 150;
    this.numberCircles = 7;

    this.initialize();
    this.dateFormat = timeFormat('%A %H');
  }

  initialize() {
    // fetch and then render
    this.fetchData()
      .then(() => this.render());
  }

  getTooltipContent(target) { // eslint-disable-line class-methods-use-this
    const { dictionary } = this;
    const data = select(target).datum();
    return `
      <p class="title">${data.category}</p>
      <p class="note">${this.dateFormat(data.date)}:00</p>
      <p class="note">Average ${data.average} ${dictionary.time_unit}</p>
      <p class="note">Value ${data.value} ${dictionary.time_unit}</p>
    `;
  }

  moveHandle(positionX) {
    this.handleConfig.target = positionX;
    this.handleConfig.timer.restart(this.moveTween);
  }

  moveTween() {
    const { actual, target, alpha } = this.handleConfig;
    const error = target - actual;

    if (Math.abs(error) < 1e-3) {
      this.handleConfig.actual = target;
      this.handleConfig.timer.stop();
    } else {
      const xValue = this.xAxis(this.xAxis.invert(this.handleConfig.actual));
      const date = this.xAxis.invert(this.handleConfig.actual);
      const time = `${date.getHours()}:00`;
      this.handleConfig.actual += error * alpha;
      this.handle.select('.handle__inner').attr('cx', xValue);
      this.handle.select('.handle__outer').attr('cx', xValue);
      this.handle.select('.handle__text')
        .attrs({
          x: xValue
        })
        .text(`${time}`);
    }
  }

  updateCircles(xValue) {
    const date = this.xAxis.invert(xValue);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const data = this.data.filter(row => row.date.getTime() === date.getTime());

    const dataCircles = select('.data-circles');
    const circles = dataCircles
      .selectAll('circle')
      .data(data);

    circles
      .transition()
      .duration(450)
      .ease(easeCircle)
      .attr('r', d => this.radiusScale(DayOnTheWeb.areaToRadius(d.value)));
  }

  initCanvas() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay()); // setting on monday
    startDate.setHours(0); // setting first milisecond on midnight
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    this.data = this.data.map((d) => {
      const newDate = new Date(startDate);
      newDate.setTime(newDate.getTime() + (d.index * 60 * 60 * 1000));
      return Object.assign({}, d, { date: newDate });
    });

    const chartContainer = select('#vis-day-on-the-web');
    const width = this.width;
    const margin = { right: 50, left: 50, top: 70 };
    const circleDimension = this.width / this.numberCircles;
    const height = this.sliderHeight + margin.top + circleDimension;
    const axisWidth = width - margin.left - margin.right;

    this.chartEl = chartContainer.append('svg');
    this.chartEl.attrs({ width, height });

    this.xAxis = scaleTime()
      .domain(extent(this.data, d => d.date))
      .range([0, axisWidth])
      .clamp(true);

    this.handleConfig = {
      actual: 0,
      target: 0,
      alpha: 0.2,
      timer: timer(this.moveTween)
    };
  }

  addLabels() {
    const data = this.data.filter(
      (obj, pos, arr) => arr.map(mapObj => mapObj.category).indexOf(obj.category) === pos
    ).map(row => row.category);

    const labelsEl = document.querySelector('#labels');

    data.forEach((d) => {
      const node = document.createElement('p');
      node.className += 'labels__label';
      const textnode = document.createTextNode(d);
      node.appendChild(textnode);
      labelsEl.appendChild(node);
    });
  }

  static areaToRadius(area) {
    return Math.sqrt(area / Math.PI);
  }

  initCircles() {
    // Takes first filtered average from data rather than calculating average
    const averageData = this.data.filter((obj, pos, arr) =>
      arr.map(mapObj => mapObj.category).indexOf(obj.category) === pos);

    const initData = this.data.filter(row =>
      row.date.getTime() === this.xAxis.invert(this.handleConfig.target).getTime());

    const avgMax = max(averageData, d => d.average);
    const valMax = max(this.data, d => d.value);

    const margin = { top: 70 };
    const padding = 10;
    const circleDimension = this.width / this.numberCircles;

    const radiusScale = scaleLinear()
      .domain([0, DayOnTheWeb.areaToRadius(max([avgMax, valMax]))])
      .range([0, (circleDimension / 2) - padding])
      .clamp(true);

    const dataCircles = this.chartEl.append('g')
      .attr('class', 'data-circles')
      .attr('transform', `translate(${(circleDimension / 2)}, ${this.sliderHeight + margin.top + (circleDimension / 2)})`);

    const averageCircles = this.chartEl.append('g')
      .attr('class', 'average-circles')
      .attr('transform', `translate(${(circleDimension / 2)}, ${this.sliderHeight + margin.top + (circleDimension / 2)})`);

    averageCircles.selectAll('circle')
      .data(averageData)
      .enter()
      .append('circle')
      .attrs({
        class: 'circle circle--average',
        r: d => radiusScale(DayOnTheWeb.areaToRadius(d.average)),
        cx: (d, i) => (circleDimension * i),
        data: d => d.average,
        title: d => d
      });

    dataCircles.selectAll('circle')
      .data(initData)
      .enter()
      .append('circle')
      .attrs({
        class: 'circle circle--active',
        r: d => radiusScale(DayOnTheWeb.areaToRadius(d.value)),
        cx: (d, i) => (circleDimension * i),
        data: d => d.value,
        title: d => d
      });

    this.instantiateTooltip('.circle--active');

    this.radiusScale = radiusScale;
  }

  initSlider() {
    const totalBorderWidth = 3;
    const shadowWidth = 7;
    const width = Number(this.chartEl.attr('width')) - totalBorderWidth;
    const height = this.sliderHeight - totalBorderWidth;
    const margin = { right: 50, left: 50 };

    const slider = this.chartEl.append('g')
      .attr('class', 'slider');

    // Add slider container
    slider.append('rect')
      .attrs({ class: 'slider__container', x: 2, y: 2, width: width - shadowWidth, height });

    slider.insert('rect', '.slider__container')
      .attrs({ class: 'slider__container slider__container--background', x: 2, y: 2, width: width - shadowWidth, height })
      .attr('transform', `translate(${shadowWidth}, ${shadowWidth})`);

    const sliderComponent = slider.append('g')
      .attrs({
        class: 'slider__component',
        transform: `translate(${margin.left}, ${height / 2})`
      });

    // Add ticks
    const ticks = axisTop(this.xAxis)
      .ticks(timeDay.every(1))
      .tickSize(10)
      .tickPadding(0)
      .tickFormat(timeFormat('%A'));

    sliderComponent.call(ticks);

    // Add slider axis and handle
    sliderComponent.append('line')
      .attrs({
        class: 'track',
        x1: this.xAxis.range()[0],
        x2: this.xAxis.range()[1]
      })
      .select(function n() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr('class', 'track-inset')
      .select(function m() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr('class', 'track-overlay')
      .call(drag()
        .on('start.interrupt', () => { slider.interrupt(); })
        .on('start drag', () => {
          this.moveHandle(event.x);
          this.updateCircles(event.x);
        }));

    // Add Handle
    this.handle = sliderComponent.insert('g', '.track-overlay')
      .attr('class', 'handle');

    this.handle.append('circle')
      .attrs({
        class: 'handle__outer',
        r: 15
      });

    this.handle.append('circle')
      .attrs({
        class: 'handle__inner',
        r: 3
      });

    this.handle.append('text')
      .attrs({
        class: 'handle__text',
        'text-anchor': 'middle',
        transform: `translate(${0}, ${40})`
      });
  }

  render() {
    this.initCanvas();
    this.initSlider();
    this.initCircles();
    this.addLabels();
  }
}

export default DayOnTheWeb;
