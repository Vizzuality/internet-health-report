import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { extent, range } from 'd3-array';
import { areaRadial, lineRadial, curveLinearClosed } from 'd3-shape';
import scaleRadial from './helpers/scale-radial';
import AbstractVisualization from './AbstractVisualization';

export default class AppUnhappiness extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    this.initialize();
  }

  initialize() {
    // fetch and then render
    this.fetchData()
      .then(() => this.render());
  }

  getTooltipContent(target) { // eslint-disable-line class-methods-use-this
    const data = select(target).datum();
    return `
      <p class="title">${data.name}</p>
      <p class="number">${data.happy_percentage}%</p>
      <p class="note">${Math.round(data.avg_minutes_happy)} minutes</p>
      <p class="note">${Math.round(data.avg_minutes_unhappy)} minutes</p>
    `;
  }

  renderChart() {
    const { el } = this;

    // parsing data
    const data = this.data.map(d => ({
      name: d.label,
      happy_percentage: Number(d.happy_percentage * 100),
      avg_minutes_happy: Number(d.avg_minutes_happy * 100),
      avg_minutes_unhappy: Number(d.avg_minutes_unhappy * 100)
    })).sort((a, b) => b.happy_percentage - a.happy_percentage);

    // Creating svg
    const svg = select(el).append('svg');
    const margin = { top: 170, left: 50, right: 50, bottom: 70 };
    const width = this.width - margin.left - margin.right;
    const height = this.height - margin.top - margin.bottom;
    const radius = height / 2;
    const dataLength = data.length;

    svg
      .attr('width', this.width)
      .attr('height', this.height);

    const g = svg.append('g')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Scales
    const rScale = scaleLinear()
      .domain([0, 100])
      .range([0, radius]);

    const xScale = scaleLinear()
      .domain([0, dataLength - 1])
      .range([0, 2 * Math.PI]);

    const yScale = scaleRadial()
      .domain(extent(data, d => d.happy_percentage)) // 0-100 percentages
      .range([0, radius]);

    const areaDomain = [].concat(
      extent(data, d => d.avg_minutes_happy),
      extent(data, d => d.avg_minutes_unhappy)
    );
    const areaScale = scaleRadial()
      .domain(extent(areaDomain))
      .range([0, radius]);

    // Area
    const happyArea = areaRadial()
      .angle((d, i) => xScale(i))
      .innerRadius(yScale(0))
      .outerRadius(d => areaScale(d.avg_minutes_happy));

    const unHappyArea = areaRadial()
      .angle((d, i) => xScale(i))
      .innerRadius(yScale(0))
      .outerRadius(d => areaScale(d.avg_minutes_unhappy));

    g.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .append('path')
      .attr('class', 'area happy')
      .datum(data)
      .attr('d', happyArea);

    g.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .append('path')
      .attr('class', 'area unhappy')
      .datum(data)
      .attr('d', unHappyArea);

    // Line
    const line = lineRadial()
      .angle((d, i) => xScale(i))
      .radius(d => yScale(d.happy_percentage))
      .curve(curveLinearClosed);

    g.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .append('path')
      .attr('class', 'line')
      .datum(data)
      .attr('d', line);

    // Radial Axis
    const rAxis = g.append('g')
      .attr('class', 'r axis')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .selectAll('g')
      .data(rScale.ticks(5))
      .enter()
      .append('g');

    rAxis.append('circle')
      .attr('r', rScale);

    rAxis.append('text')
      .attr('y', d => -rScale(d) - 4)
      .attr('transform', 'translate(4, 0)')
      .text(d => d);

    // Outer axis labels
    const labelRadius = radius + 15;
    const anglePerItem = (360 / (dataLength));
    const ga = g.append('g')
      .attr('class', 'outer-axis-tick')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .selectAll('g')
      .data(range(-270, 90, anglePerItem).reverse())
      .enter()
      .append('g')
      .attr('transform', d => `rotate(${-d - anglePerItem})`);

    ga.append('text')

      .attr('class', 'label')
      .attr('x', labelRadius)
      .attr('dy', 4)
      .style('text-anchor', d => ((d >= -270 && d < -90) ? 'end' : null))
      .attr('transform', d => ((d >= -270 && d < -90) ? `rotate(180 ${labelRadius}, 0)` : null))
      .data(data)
      .text(d => d.name)
      .attr('title', d => d.name);

    this.instantiateTooltip('.label');
  }

  renderLegend() {
    const { el, config, dictionary } = this;
    const mainColor = config.color || '#6dd8af';
    const legendElement = document.createElement('div');
    legendElement.classList.add('app-unhappiness-vis-legend');
    legendElement.innerHTML = `<ul>
      <li><span class="icon-line"></span> ${dictionary.happy_percentage}</li>
      <li><span style="background-color: ${mainColor}; border-color: ${mainColor}"></span>${dictionary.happy_avg_minutes}</li>
      <li><span class="unhappy-icon"></span>${dictionary.unhappy_avg_minutes}</li>
    </ul>`;
    el.appendChild(legendElement);
  }

  render() {
    this.renderLegend();
    this.renderChart();
  }
}
