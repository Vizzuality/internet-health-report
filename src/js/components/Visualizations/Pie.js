import { select } from 'd3-selection';
import { scaleOrdinal } from 'd3-scale';
import { pie as d3Pie, arc as d3Arc } from 'd3-shape';
import tippy from 'tippy.js/dist/tippy.min';

import AbstractVisualization from 'components/Visualizations/AbstractVisualization';

export default class Pie extends AbstractVisualization {
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
          value: +d.value
        })).sort((a, b) => b.value - a.value);

        // We group the items whose combined values are lower
        // than the threshold
        this.data.concat().sort((a, b) => a.value - b.value)
          .reduce((res, d) => {
            if (res + d.value <= (this.config.threshold || 0.15)) {
              d.grouped = true; // eslint-disable-line no-param-reassign
            } else {
              d.grouped = false; // eslint-disable-line no-param-reassign
            }
            return res + d.value;
          }, 0);
      })
      .catch(() => {})
      .then(() => this.render());
  }

  getTooltipContent(target) { // eslint-disable-line class-methods-use-this
    const d = select(target).datum();

    let label = d.label;
    let value = d.value;

    if (target.nodeName === 'circle') {
      label = d.data.label;
      value = d.data.value;
    }

    return `
      <div class="number">${this.valueFormat(value)}</div>
      ${label ? `<div class="title">${label}</div>` : ''}
    `;
  }

  render() {
    super.render();
    if (!this.data) return;

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

    const whitePatterns = this.patterns.map((p, i) => (i === 2 ? p.fill('#fff') : p.background('#fff')));
    const patterns = this.patterns.slice(0, this.data.filter(d => !d.grouped).length)
      .concat(whitePatterns.slice(1));

    patterns.forEach(p => this.svg.call(p));

    const patternsScale = scaleOrdinal()
      .domain(labels)
      .range(patterns.map(p => p.url()));

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
      .data(this.data.map(d => d.label))
      .enter()
      .append('g');

    legendItem.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', c => patternsScale(c))
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
    let jumpedLineForStackedBar = false;
    const self = this;
    legendItem
      .attr('transform', function (l) { // eslint-disable-line func-names
        const width = this.getBBox().width + 40;
        const nextXPosition = currentXPosition + width;
        const data = self.data.find(d => d.label === l);
        if (nextXPosition > self.titleBounds.width || (data.grouped && !jumpedLineForStackedBar)) {
          currentRow++; // eslint-disable-line no-plusplus
          currentXPosition = self.legendBounds.x;

          if (data.grouped) {
            jumpedLineForStackedBar = true;
          }
        }
        const res = `translate(${currentXPosition}, ${currentRow * (self.legendBounds.height)})`;
        currentXPosition += width;
        return res;
      });

    this.config.legendRows = currentRow + 1;

    // Marks
    const groupedData = this.data.filter(d => !d.grouped);
    groupedData.unshift(
      this.data.filter(d => d.grouped)
        .reduce((res, d) => Object.assign(res, {
          value: res.value + d.value,
          data: res.data.concat([d])
        }), { label: null, value: 0, data: [] })
    );

    // The first slice of the pie chart needs to be the one that
    // sums the small values, and it needs to be centered horizontally
    // NOTE: we can't just rotate the pie chart because the patterns
    // won't be in the correct direction
    const groupedSliceAngle = (groupedData[0].value / groupedData
      .reduce((res, { value }) => res + value, 0))
      * (2 * Math.PI);
    const startAngle = (Math.PI / 2) - (groupedSliceAngle / 2);
    const endAngle = startAngle + (2 * Math.PI);

    const pie = d3Pie()
      .value(d => d.value)
      .sortValues(null)
      .startAngle(startAngle)
      .endAngle(endAngle);

    const radius = this.visualizationBounds.width > this.visualizationBounds.height
      ? (this.visualizationBounds.height / 2) - 1 // 1px for the stroke
      : (this.visualizationBounds.width / 2) - 1;

    const arc = d3Arc()
      .innerRadius(0)
      .outerRadius(radius);

    const piedData = pie(groupedData);

    const marksContainer = container.append('g')
      .attr('class', 'marks')
      .attr('transform', `translate(${this.visualizationBounds.x}, ${this.visualizationBounds.y})`);


    // Link between pie chart and staked bar
    const pieMargin = 150; // Margin between the pie chart and staked bar

    marksContainer.append('g')
      .attr('transform', `translate(${radius}, ${this.visualizationBounds.height / 2})`)
      .selectAll('line')
      .data([
        {
          x1: (radius * Math.cos(groupedSliceAngle / 2)) + 2,
          x2: radius + (pieMargin - 2),
          y1: -radius * Math.sin(groupedSliceAngle / 2),
          y2: -radius
        },
        {
          x1: (radius * Math.cos(groupedSliceAngle / 2)) + 2,
          x2: radius + (pieMargin - 2),
          y1: radius * Math.sin(groupedSliceAngle / 2),
          y2: radius
        }
      ])
      .enter()
      .append('line')
      .attr('x1', d => d.x1)
      .attr('x2', d => d.x2)
      .attr('y1', d => d.y1)
      .attr('y2', d => d.y2)
      .attr('stroke', '#000')
      .attr('stroke-width', 2);

    // Pie chart

    // These circles are used to position the tooltip
    // of the pie chart
    const centroids = marksContainer
      .append('g')
      .attr('transform', `translate(${radius + 2}, ${this.visualizationBounds.height / 2})`)
      .selectAll('circle')
      .data(piedData)
      .enter()
      .append('circle')
      .attr('cx', d => arc.centroid(d)[0])
      .attr('cy', d => arc.centroid(d)[1])
      .attr('r', 1)
      .attr('opacity', 0)
      .attr('title', d => d.data.value);

    let pieTooltip = null;

    marksContainer
      .append('g')
      .attr('transform', `translate(${radius + 2}, ${this.visualizationBounds.height / 2})`)
      .selectAll('path')
      .data(piedData)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => (d.data.label ? patternsScale(d.data.label) : '#fff'))
      .attr('stroke', '#000')
      .attr('stroke-width', 2)
      .attr('title', d => d.data.value)
      .on('mouseover', function (d) { // eslint-disable-line func-names, prefer-arrow-callback
        if (pieTooltip) return; // Only one tooltip at a time

        const target = centroids.filter(c => c.data.label === d.data.label).node();

        // Content of the tooltip
        const html = document.createElement('div');
        html.innerHTML = `
          <div class="c-tooltip ,s-tooltip">
            ${self.getTooltipContent(target)}
          </div>
        `;

        pieTooltip = tippy(target, {
          animateFill: false,
          animation: 'shift-toward',
          inertia: true,
          theme: 'ihr',
          html,
          arrow: true,
          interactive: false
        });

        pieTooltip.tooltips[0].show();
      })
      .on('mouseout', () => {
        pieTooltip.tooltips[0].destroy();
        pieTooltip = null;
      });

    let sum = 0;
    const stakedData = groupedData[0].data
      .reverse()
      .map((d) => {
        const res = {
          y: sum,
          height: (d.value / groupedData[0].value) * (this.visualizationBounds.height - 2),
          label: d.label,
          value: d.value
        };

        sum += res.height;

        return res;
      });

    // Stacked bar
    marksContainer
      .append('g')
      .attr('transform', `translate(${(2 * radius) + (pieMargin - 2)}, 0)`)
      .selectAll('rect')
      .data(stakedData)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', d => d.y)
      .attr('width', this.visualizationBounds.width - (2 * radius) - pieMargin)
      .attr('height', d => d.height)
      .attr('fill', d => patternsScale(d.label))
      .attr('stroke', '#000')
      .attr('stroke-width', 2)
      .attr('title', d => d.value);

    this.instantiateTooltip('rect');
  }
}
