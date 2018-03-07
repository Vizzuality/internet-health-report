import { select } from 'd3-selection';
import { scaleBand, scaleOrdinal, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisRight, axisBottom } from 'd3-axis';
import { stack as d3Stack } from 'd3-shape';
import { format } from 'd3-format';

import AbstractVisualization from 'components/Visualizations/AbstractVisualization';

export default class StackedBar extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    this.initialize();
  }

  initialize() {
    this.fetchData()
      .then(() => {
        const labels = this.data.map(d => d.label)
          .filter((d, i, arr) => arr.indexOf(d) === i);

        // We transform the data to it has this structure:
        // { label: 'label_value', [category_1]: 'value', [category_2]: 'value', ... }[]
        this.data = labels.map((label) => {
          const rows = this.data.filter(d => d.label === label);
          return rows.map(r => ({ [r.category]: +r.value }))
            .reduce((res, o) => Object.assign(res, o), { label });
        });
      })
      .catch(() => {})
      .then(() => this.render());
  }

  getTooltipContent(target) { // eslint-disable-line class-methods-use-this
    const d = select(target).datum();
    return `${d[1] - d[0]}`;
  }

  render() {
    super.render();
    if (!this.data) return;

    const svg = select(this.el).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
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

    const categories = Object.keys(this.data[0])
      .filter(k => k !== 'label');

    this.patterns.forEach(p => svg.call(p));

    const categoryFillScale = scaleOrdinal()
      .domain(categories)
      .range(this.patterns.map(p => p.url()));

    const container = svg.append('g')
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
    let currentXPosition = this.legendBounds.x;
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
    legendItem
      .attr('transform', function () { // eslint-disable-line func-names
        const res = `translate(${currentXPosition}, 0)`;
        currentXPosition += this.getBBox().width + 40;
        return res;
      });

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
      .domain([0, max(this.data, d => categories.map(c => d[c]).reduce((res, v) => res + v, 0))])
      .rangeRound(
        this.direction === 'horizontal'
          ? [0, this.valueAxisBounds.width]
          : [this.valueAxisBounds.height, 0]
      );

    const valueAxis = (this.direction === 'horizontal' ? axisBottom : axisRight)(valueScale)
      .tickPadding(10)
      .tickSize(0)
      .tickFormat(format(this.valueFormat));

    container.append('g')
      .attr('class', 'value-axis')
      .attr('transform', `translate(${this.valueAxisBounds.x}, ${this.valueAxisBounds.y})`)
      .call(valueAxis)
      .selectAll('text')
      .attr('dominant-baseline', this.direction === 'horizontal' ? 'central' : '');

    // Rules
    container.append('g')
      .attr('class', 'rules')
      .attr('transform', this.direction === 'horizontal' ? `translate(${this.visualizationBounds.x}, 0)` : `translate(0, ${this.valueAxisBounds.y})`)
      .selectAll('line')
      .data(valueScale.ticks())
      .enter()
      .append('line')
      .attr('x1', (d) => {
        if (this.direction === 'horizontal') {
          return valueScale(d);
        }
        return this.visualizationBounds.x;
      })
      .attr('x2', (d) => {
        if (this.direction === 'horizontal') {
          return valueScale(d);
        }
        return this.valueAxisBounds.x + this.valueAxisBounds.width;
      })
      .attr('y1', (d) => {
        if (this.direction === 'horizontal') {
          return this.visualizationBounds.y;
        }
        return valueScale(d);
      })
      .attr('y2', (d) => {
        if (this.direction === 'horizontal') {
          return this.valueAxisBounds.y + this.valueAxisBounds.height;
        }
        return valueScale(d);
      });

    // Label axis
    const labelScale = scaleBand()
      .domain(labels)
      .rangeRound(this.direction === 'horizontal' ? [0, this.visualizationBounds.height] : [0, this.visualizationBounds.width])
      .paddingInner(0.2)
      .paddingOuter(0.2);

    const labelAxis = (this.direction === 'horizontal' ? axisRight : axisBottom)(labelScale)
      .tickPadding(10)
      .tickSize(0);

    container.append('g')
      .attr('class', 'label-axis')
      .attr('transform', `translate(${this.labelAxisBounds.x}, ${this.labelAxisBounds.y})`)
      .call(labelAxis);

    // Marks
    const stack = d3Stack()
      .keys(categories);

    const stackedData = stack(this.data);

    container
      .append('g')
      .attr('class', 'marks')
      .attr('transform', `translate(${this.visualizationBounds.x}, ${this.visualizationBounds.y})`)
      .selectAll('g')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', d => categoryFillScale(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', (d) => {
        if (this.config.direction === 'horizontal') {
          return valueScale(d[0]);
        }
        return labelScale(d.data.label);
      })
      .attr('y', (d) => {
        if (this.config.direction === 'horizontal') {
          return labelScale(d.data.label);
        }
        return valueScale(d[1]);
      })
      .attr('width', (d) => {
        if (this.config.direction === 'horizontal') {
          return valueScale(d[1]) - valueScale(d[0]);
        }
        return labelScale.bandwidth();
      })
      .attr('height', (d) => {
        if (this.config.direction === 'horizontal') {
          return labelScale.bandwidth();
        }
        return valueScale(d[0]) - valueScale(d[1]);
      })
      .attr('title', d => d[1] - d[0])
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // Value above the rectangle
    const maxData = stackedData[stackedData.length - 1]
      .map(arr => ({ value: arr[1], label: arr.data.label }));

    container.append('g')
      .attr('class', 'value-outline')
      .attr('transform', `translate(${this.visualizationBounds.x}, ${this.visualizationBounds.y})`)
      .selectAll('text')
      .data(maxData)
      .enter()
      .append('text')
      .attr('x', (d) => {
        if (this.direction === 'horizontal') {
          return valueScale(d.value);
        }
        return labelScale(d.label) + (labelScale.bandwidth() / 2);
      })
      .attr('y', (d) => {
        if (this.direction === 'horizontal') {
          return labelScale(d.label) + (labelScale.bandwidth() / 2);
        }
        return valueScale(d.value);
      })
      .attr('text-anchor', this.direction === 'horizontal' ? 'start' : 'middle')
      .attr('dominant-baseline', this.direction === 'horizontal' ? 'central' : '')
      .text(d => format(this.valueFormat)(d.value));

    container.append('g')
      .attr('class', 'value')
      .attr('transform', `translate(${this.visualizationBounds.x}, ${this.visualizationBounds.y})`)
      .selectAll('text')
      .data(maxData)
      .enter()
      .append('text')
      .attr('x', (d) => {
        if (this.direction === 'horizontal') {
          return valueScale(d.value);
        }
        return labelScale(d.label) + (labelScale.bandwidth() / 2);
      })
      .attr('y', (d) => {
        if (this.direction === 'horizontal') {
          return labelScale(d.label) + (labelScale.bandwidth() / 2);
        }
        return valueScale(d.value);
      })
      .attr('text-anchor', this.direction === 'horizontal' ? 'start' : 'middle')
      .attr('dominant-baseline', this.direction === 'horizontal' ? 'central' : '')
      .text(d => format(this.valueFormat)(d.value));

    // We instantiate the tooltip
    this.instantiateTooltip('rect');
  }
}
