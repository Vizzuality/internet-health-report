import { select } from 'd3-selection';
import { scaleBand, scaleOrdinal, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisRight, axisBottom } from 'd3-axis';
import { stack as d3Stack } from 'd3-shape';

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
    return `${this.valueFormat(d[1] - d[0])}`;
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

    const patterns = this.patterns;
    patterns.forEach(p => svg.call(p));

    const categoryFillScale = scaleOrdinal()
      .domain(categories)
      .range(patterns.map(p => p.url()));

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
      .attr('transform', 'translate(25, 7.5)')
      .attr('x', 0)
      .attr('y', 0)
      .text(c => c)
      .attr('text-anchor', 'left')
      .attr('dominant-baseline', 'central');

    if (this.breakdownLegend) {
      // Each item of the legend is on a different line and if
      // the text associated to an item is too long, it's wrapped
      // into a new line
      let currentHeight = 0;
      const initialSize = this.legendBounds.height;

      legendItem.selectAll('text')
        .call(this.wrapText, this.legendBounds.width - 25, 25, 1, 0);

      legendItem.attr('transform', function () { // eslint-disable-line func-names
        const res = `translate(0, ${currentHeight})`;
        // The 10px are a space between two items of the legend
        currentHeight += this.getBBox().height + 10;
        return res;
      });

      // The 10px are a space between the legend and the chart
      this.config.legendRows = (currentHeight + 10) / initialSize;
    } else {
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

    // Label axis
    // NOTE: must be before the value axis for the dynamic label wrapping feature
    const labelScale = scaleBand()
      .domain(labels)
      .rangeRound(this.direction === 'horizontal' ? [0, this.visualizationBounds.height] : [0, this.visualizationBounds.width])
      .paddingInner(0.2)
      .paddingOuter(0.2);

    const labelAxis = (this.direction === 'horizontal' ? axisRight : axisBottom)(labelScale)
      .tickPadding(10)
      .tickSize(0);

    const labelAxisContainer = container.append('g')
      .attr('class', 'label-axis')
      .attr('transform', `translate(${this.labelAxisBounds.x}, ${this.labelAxisBounds.y})`)
      .call(labelAxis);

    if (this.dynamicLabelWrapping) {
      labelAxisContainer.selectAll('.tick text')
        .call(this.wrapText, labelScale.bandwidth());

      // We update the size of the axis
      const labelAxisSize = labelAxisContainer.node().getBBox().height;
      this.config.labelAxisSize = labelAxisSize;

      // And recalculate its position
      labelAxisContainer.attr('transform', `translate(${this.labelAxisBounds.x}, ${this.labelAxisBounds.y})`);
    }

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
      .tickFormat(this.valueFormat);

    container.append('g')
      .attr('class', 'value-axis')
      .attr('transform', `translate(${this.valueAxisBounds.x}, ${this.valueAxisBounds.y})`)
      .call(valueAxis.ticks(this.valueAxisTicks))
      .selectAll('text')
      .attr('dominant-baseline', this.direction === 'horizontal' ? 'central' : '')
      .attr('text-anchor', this.direction === 'horizontal' ? 'start' : 'middle');

    // Rules
    container.append('g')
      .attr('class', 'rules')
      .attr('transform', this.direction === 'horizontal' ? `translate(${this.visualizationBounds.x}, 0)` : `translate(0, ${this.valueAxisBounds.y})`)
      .selectAll('line')
      .data(valueScale.ticks(this.valueAxisTicks))
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
      .map(arr => ({ value: arr[1] || arr[0], label: arr.data.label }));

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
      .text(d => this.valueFormat(d.value));

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
      .text(d => this.valueFormat(d.value));

    // We instantiate the tooltip
    this.instantiateTooltip('rect');
  }
}
