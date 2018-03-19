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
    const margin = { top: 170, left: 50, right: 50, bottom: 50 };
    const width = el.clientWidth - margin.left - margin.right;
    const height = el.clientHeight - margin.top - margin.bottom;
    const radius = height / 2;
    const dataLength = data.length;

    svg
      .attr('width', el.clientWidth)
      .attr('height', el.clientHeight);

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
      .attr('class', 'area unhappy')
      .datum(data)
      .attr('d', unHappyArea);

    g.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .append('path')
      .attr('class', 'area happy')
      .datum(data)
      .attr('d', happyArea);

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
      .attr('x', labelRadius)
      .attr('dy', 4)
      .style('text-anchor', d => ((d < 270 && d > 90) ? 'end' : null))
      .attr('transform', d => ((d < 270 && d > 90) ? `rotate(180 ${labelRadius}, 0)` : null))
      .text((d, i) => (data[i] ? data[i].name : ''));
  }

  renderLegend() {
    const { el } = this;
    const legendElement = document.createElement('div');
    legendElement.classList.add('app-unhappiness-vis-legend');
    legendElement.innerHTML = `<ul>
      <li class="happy-percent-icon">% Happy</li>
      <li class="happy-icon">Happy Average on Screen (minutes)</li>
      <li class="unhappy-icon">Unhappy Average on Screen (minutes)</li>
    </ul>`;
    el.appendChild(legendElement);
  }

  render() {
    this.renderChart();
    this.renderLegend();
  }
}
