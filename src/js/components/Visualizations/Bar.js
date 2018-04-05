import { select } from 'd3-selection';
import { scaleBand, scaleOrdinal, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisRight, axisBottom } from 'd3-axis';

import AbstractVisualization from 'components/Visualizations/AbstractVisualization';

export default class Bar extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    this.initialize();
    this.setListeners();
  }

  initialize() {
    this.fetchData()
      .then(() => {
        if (!this.categorical) {
          this.data = this.data.map(d => Object.assign({}, d, {
            value: +d.value
          }));
        }
      })
      .catch(() => {})
      .then(() => this.render());
  }

  render() {
    super.render();
    if (!this.data) return;

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

    const values = this.data.map(d => d.value)
      .filter((d, i, arr) => arr.indexOf(d) === i)
      .sort();

    const patterns = this.patterns;
    patterns.forEach(p => this.svg.call(p));

    const categoryFillScale = scaleOrdinal()
      .domain(categories)
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
    let valueScale;
    if (this.categorical) {
      valueScale = scaleOrdinal()
        .domain(values)
        .range(
          this.direction === 'horizontal'
            ? new Array(values.length).fill(0)
              .map((_, i) => (this.valueAxisBounds.width / values.length) * (i + 1))
            : new Array(values.length).fill(0)
              .map((_, i) => this.valueAxisBounds.height
                - ((this.valueAxisBounds.height / values.length) * (i + 1)))
        );
    } else {
      valueScale = scaleLinear()
        .domain([0, max(this.data, d => d.value)])
        .rangeRound(
          this.direction === 'horizontal'
            ? [0, this.valueAxisBounds.width]
            : [this.valueAxisBounds.height, 0]
        );
    }

    const valueAxis = (this.direction === 'horizontal' ? axisBottom : axisRight)(valueScale)
      .tickPadding(10)
      .tickSize(0);

    if (!this.categorical) {
      valueAxis.tickFormat(this.valueFormat);
    }

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
      .data(this.categorical
        ? [this.direction === 'horizontal' ? 0 : this.visualizationBounds.height].concat(valueScale.range())
        : valueScale.ticks(this.valueAxisTicks)
      )
      .enter()
      .append('line')
      .attr('x1', (d) => {
        if (this.direction === 'horizontal') {
          if (this.categorical) {
            return d;
          }
          return valueScale(d);
        }
        return this.visualizationBounds.x;
      })
      .attr('x2', (d) => {
        if (this.direction === 'horizontal') {
          if (this.categorical) {
            return d;
          }
          return valueScale(d);
        }
        return this.valueAxisBounds.x + this.valueAxisBounds.width;
      })
      .attr('y1', (d) => {
        if (this.direction === 'horizontal') {
          return this.visualizationBounds.y;
        }
        if (this.categorical) {
          return d;
        }
        return valueScale(d);
      })
      .attr('y2', (d) => {
        if (this.direction === 'horizontal') {
          return this.valueAxisBounds.y + this.valueAxisBounds.height;
        }
        if (this.categorical) {
          return d;
        }
        return valueScale(d);
      });

    // Mark rules
    const markContainer = container.append('g')
      .attr('class', 'marks')
      .attr('transform', `translate(${this.visualizationBounds.x}, ${this.visualizationBounds.y})`);

    if (this.rules.length) {
      const markRuleItem = markContainer.append('g')
        .selectAll('g')
        .data(this.rules)
        .enter()
        .append('g')
        .attr('class', 'mark-rule');

      markRuleItem.append('line')
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
            return 0;
          }
          return valueScale(d);
        })
        .attr('y2', (d) => {
          if (this.direction === 'horizontal') {
            return this.labelAxisBounds.height + this.valueAxisBounds.height;
          }
          return valueScale(d);
        })
        .attr('stroke', this.lineStyles[0].color)
        .attr('stroke-width', this.lineStyles[0].stroke)
        .attr('stroke-dasharray', this.lineStyles[0].dasharray)
        .attr('stroke-linecap', this.lineStyles[0].linecap);

      markRuleItem.append('text')
        // For some reasons the axis ticks are moved by 10px
        .attr('x', (d) => {
          if (this.direction === 'horizontal') {
            return valueScale(d);
          }
          return this.valueAxisBounds.x + 10;
        })
        .attr('y', (d) => {
          if (this.direction === 'horizontal') {
            return this.labelAxisBounds.height + this.valueAxisBounds.height;
          }
          return valueScale(d);
        })
        .attr('dy', '0.32em') // Value got from the ticks
        .attr('dominant-baseline', this.direction === 'horizontal' ? 'central' : '')
        .attr('text-anchor', this.direction === 'horizontal' ? 'start' : 'middle')
        .text(d => this.valueFormat(d));
    }

    // Marks
    const categoryScale = scaleBand()
      .domain(categories)
      .rangeRound([0, labelScale.bandwidth()])
      .paddingInner(0.1);

    const markItem = markContainer.selectAll('.group')
      .data(labels)
      .enter()
      .append('g')
      .attr('class', 'group')
      .attr('transform', (d) => {
        if (this.direction === 'horizontal') {
          return `translate(0, ${labelScale(d)})`;
        }
        return `translate(${labelScale(d)}, 0)`;
      });

    markItem.selectAll('rect')
      .data(label => this.data.filter(d => d.label === label))
      .enter()
      .append('rect')
      .attr('x', (d) => {
        if (this.direction === 'horizontal') {
          if (this.categorical) {
            return 0;
          }
          return valueScale(0);
        }
        return categoryScale(d.category);
      })
      .attr('y', (d) => {
        if (this.direction === 'horizontal') {
          return categoryScale(d.category);
        }
        return valueScale(d.value);
      })
      .attr('width', (d) => {
        if (this.direction === 'horizontal') {
          if (this.categorical) {
            return valueScale(d.value);
          }
          return valueScale(d.value) - valueScale(0);
        }
        return categoryScale.bandwidth();
      })
      .attr('height', (d) => {
        if (this.direction === 'horizontal') {
          return categoryScale.bandwidth();
        }
        if (this.categorical) {
          return this.visualizationBounds.height - valueScale(d.value);
        }
        return valueScale(0) - valueScale(d.value);
      })
      .attr('fill', d => categoryFillScale(d.category))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // Value above the rectangle
    markItem.append('g')
      .attr('class', 'value-outline')
      .selectAll('text')
      .data(label => this.data.filter(d => d.label === label))
      .enter()
      .append('text')
      .attr('x', (d) => {
        if (this.direction === 'horizontal') {
          return valueScale(d.value);
        }
        return categoryScale(d.category) + (categoryScale.bandwidth() / 2);
      })
      .attr('y', (d) => {
        if (this.direction === 'horizontal') {
          return categoryScale(d.category) + (categoryScale.bandwidth() / 2);
        }
        return valueScale(d.value);
      })
      .attr('text-anchor', this.direction === 'horizontal' ? 'start' : 'middle')
      .attr('dominant-baseline', this.direction === 'horizontal' ? 'central' : '')
      .text(d => (this.categorical ? d.value : this.valueFormat(d.value)));

    markItem.append('g')
      .attr('class', 'value')
      .selectAll('text')
      .data(label => this.data.filter(d => d.label === label))
      .enter()
      .append('text')
      .attr('x', (d) => {
        if (this.direction === 'horizontal') {
          return valueScale(d.value);
        }
        return categoryScale(d.category) + (categoryScale.bandwidth() / 2);
      })
      .attr('y', (d) => {
        if (this.direction === 'horizontal') {
          return categoryScale(d.category) + (categoryScale.bandwidth() / 2);
        }
        return valueScale(d.value);
      })
      .attr('text-anchor', this.direction === 'horizontal' ? 'start' : 'middle')
      .attr('dominant-baseline', this.direction === 'horizontal' ? 'central' : '')
      .text(d => (this.categorical ? d.value : this.valueFormat(d.value)));
  }
}
