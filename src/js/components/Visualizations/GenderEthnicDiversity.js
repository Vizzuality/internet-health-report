import { select, event } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { lineRadial, curveBasisClosed } from 'd3-shape';
import scaleRadial from './helpers/scale-radial';
import wrap from './helpers/wrap-text';
import AbstractVisualization from './AbstractVisualization';

export default class GenderEthnicDiversity extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);

    this.dataLabels = [];
    this.config = config || {};
    this.data = this.serializeData(config.data);

    this.margin = config.margin || 0;
    this.radius = config.radius || 600;
    this.innerRadius = config.innerRadius || 180;

    this.privateOffset = (this.radius / 2) + this.margin;

    this.svg = select(config.el).append('svg')
      .attr('width', this.radius)
      .attr('height', this.radius);

    this.FIT_GROUPS = `translate(${(this.privateOffset)},${(this.privateOffset)})`;

    const radius = this.calcRadius();
    const container = this.svg.append('g').attr('class', 'container').attr('transform', this.FIT_GROUPS);

    this.radialRange = [(radius.inner) - 40, this.privateOffset - 60];

    // svg groups
    this.bars = container.append('g').attr('class', 'bars');
    this.labels = container.append('g').attr('class', 'labels');
    this.lines = container.append('g').attr('class', 'lines');

    // Scales
    this.xScale = this.xScale();
    this.yScale = this.yScale();

    this.initialize();
  }

  initialize() {
    // fetch and then render
    this.fetchData()
      .then(() => this.render());
  }

  serializeData(data) {
    const out = {};
    const labels = [];

    if (data && data.length) {
      Object.keys(data[0]).forEach((label) => {
        if (label !== this.config.orderBy) {
          out[label] = { data: [] };
        }
      });
    }

    data.forEach((d) => {
      Object.keys(d).forEach((l) => {
        if (l !== this.config.orderBy) {
          out[l].data.push({ [this.config.orderBy]: d[this.config.orderBy], value: typeof d[l] === 'string' ? 0 : d[l] });
        }
      });
      labels.push(d[this.config.orderBy]);
    });

    this.dataLabels = labels;

    return out;
  }

  calcRadius() {
    return {
      inner: this.innerRadius,
      outer: this.radius / 2
    };
  }

  static fullCircle() {
    return 2 * Math.PI;
  }

  xScale() {
    return scaleLinear()
      .domain([0, this.dataLabels.length])
      .range([0, GenderEthnicDiversity.fullCircle()]);
  }

  yScale() {
    return scaleRadial()
      .domain([0, 100]) // We are dealing with percentages
      .range(this.radialRange);
  }

  renderWrapperArc() {
    const yTick = this.labels
      .selectAll('g')
      .data(this.yScale.ticks(3))
      .enter().append('g');

    yTick.append('text')
      .attr('y', d => -this.yScale(d))
      .attr('dy', '1em')
      .text(d => `${d}%`);

    yTick.append('circle')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-dasharray', ('10', '10'))
      .attr('opacity', 0.3)
      .attr('r', this.yScale);
  }

  renderLabels() {
    const bars = this.bars.selectAll('.bar');
    bars.append('text')
      .attr('dy', '0.31em')
      .style('font-size', '12px')
      .attr('opacity', 0.6)
      .attr('text-anchor', 'start')
      .attr('transform', () => {
        const yFirstPoint = this.yScale(0) + 15;
        return `translate(${yFirstPoint}, 0)`;
      })
      .text((d, i) => this.dataLabels[i])
      .call(wrap, 50);
  }

  generateRadialLine(data, label) {
    const radialLine = lineRadial()
      .angle((d, i) => this.xScale(i))
      .radius(d => this.yScale(d.value))
      .curve(curveBasisClosed);

    this.lines.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', () => this.config.colors[label.toLowerCase()])
      .attr('d', radialLine);
  }

  // Finds the original data set
  findOriginalData(data) {
    return this.config.data.filter(d => d[this.config.orderBy] === data.company)[0];
  }

  handleMouseOver(data) {
    if (this.config.onMouseOver && typeof this.config.onMouseOver === 'function') {
      this.config.onMouseOver(event, this.findOriginalData(data));
    }
  }

  handleMouseOut(data) {
    if (this.config.onMouseOut && typeof this.config.onMouseOut === 'function') {
      this.config.onMouseOut(event, data);
    }
  }

  generateRadialBars(data = [], conf = { color: '#000' }) {
    const xCalculateBoundsInner = this.bars
      .selectAll('.bar')
      .data(data)
      .enter().append('g')
      .style('pointer-events', 'all')
      .attr('class', 'bar')
      .attr('text-anchor', 'middle')
      .attr('data-v', d => d.value)
      .attr('transform', (d, i) => {
        const yFirstPoint = this.yScale(0);
        return `rotate(${((this.xScale(i) * 180) / (Math.PI - 90))})translate(${yFirstPoint}, 5)`;
      })
      .on('mouseover', this.handleMouseOver.bind(this))
      .on('mouseout', this.handleMouseOut.bind(this));

    xCalculateBoundsInner.append('line')
      .attr('x2', (d) => {
        const yFirstPoint = this.yScale(0);
        return this.yScale(d.value) - yFirstPoint;
      })
      .attr('stroke', conf.color)
      .attr('stroke-width', 10);

    // Hidden line that captures the hover event
    xCalculateBoundsInner.append('line')
      .attr('x2', () => {
        const yFirstPoint = this.yScale(0);
        return this.yScale(100) - yFirstPoint;
      })
      .attr('stroke', 'transparent')
      .attr('stroke-width', 10);
  }

  getData(label) {
    return this.data[label].data;
  }

  paintChart() {
    const { config } = this;

    let bars = config.bars || [];
    let lines = config.lines || [];

    this.renderWrapperArc();

    Object.keys(this.data).forEach((l) => {
      const label = l.toLowerCase();

      if (bars.indexOf(label) > -1) {
        this.generateRadialBars(this.getData(l), {
          color: this.config.colors[label]
        });
        bars = bars.filter(b => b !== label);
      }

      if (lines.indexOf(label) > -1) {
        this.generateRadialLine(this.getData(l), label);
        lines = lines.filter(line => (line !== label));
      }
    });

    this.renderLabels(this.dataLabels);
  }

  render() {
    this.paintChart();
  }
}
