import AbstractVisualization from 'components/Visualizations/AbstractVisualization';
import { select, event } from 'd3-selection';
import { zoom } from 'd3-zoom';
import { forceSimulation, forceX, forceY, forceLink, forceManyBody } from 'd3-force';

export default class Bar extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);

    this.config = config;
    this.config.height = 600;
    this.config.padding = 20;
    this.config.nodeSizes = [50, 20, 5];

    this.initialize();
  }

  initialize() {
    this.fetchData()
      .catch(() => {})
      .then(() => this.render());
  }

  /**
   * Event handler executed when the user zooms
   * the visualization
  */
  onZoom() {
    this.g.attr('transform', event.transform);
  }

  /**
   * Event handler executed when the simulation
   * loop ticks
  */
  onTick() {
    this.g.select('.links')
      .selectAll('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    this.g.select('.nodes-shadow')
      .selectAll('circle')
      .attr('cx', d => d.x + 3)
      .attr('cy', d => d.y + 3);

    this.g.select('.nodes')
      .selectAll('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => this.config.nodeSizes[d.depth]);

    this.g.select('.labels')
      .selectAll('text')
      .attr('dx', d => d.x)
      .attr('dy', d => d.y);
  }

  render() {
    super.render();
    if (!this.data) return;

    const width = this.el.offsetWidth;
    const height = this.config.height;
    const z = zoom()
      .scaleExtent([1 / 5, 2])
      .on('zoom', this.onZoom.bind(this));

    const svg = select(this.el).append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(z);

    this.g = svg.append('g');

    // We set the default zoom and center
    z.scaleBy(svg, 0.7);
    z.translateBy(svg, width / 2, height / 2);

    const nodes = this.data.nodes;
    const links = this.data.links;

    const firstDepthNodeCount = nodes.filter(n => n.depth === 1).length;
    const secondDepthNodeCount = nodes.filter(n => n.depth === 2).length;

    /* eslint-disable no-param-reassign */
    nodes.forEach((node, index) => {
      if (node.depth !== 0) {
        // By spreading the nodes around the central
        // one, we improve the visual aspect of the
        // visualization when it's searching for a
        // stability point
        const total = node.depth === 1 ? firstDepthNodeCount : secondDepthNodeCount;
        node.x = width * Math.cos((index / total) * 2 * Math.PI);
        node.y = width * Math.sin((index / total) * 2 * Math.PI);
      } else {
        // We fix the central node at the center
        // of the screen (a translation has been made
        // right above so (0, 0) is the center)
        node.x = 0;
        node.y = 0;
        node.fy = 0;
        node.fx = 0;
      }
    });
    /* eslint-enable no-param-reassign */

    this.g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', (d) => {
        const sourceNode = nodes[d.source];
        const targetNode = nodes[d.target];
        return sourceNode.depth === 0 || targetNode.depth === 0 ? 2 : 1;
      })
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    this.g.append('g')
      .attr('class', 'nodes-shadow')
      .selectAll('circle')
      .data(nodes.filter(n => n.depth <= 1))
      .enter()
      .append('circle')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('cx', d => d.x + 3)
      .attr('cy', d => d.y + 3)
      .attr('r', d => this.config.nodeSizes[d.depth]);

    this.g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('stroke', 'black')
      .attr('stroke-width', d => (d.depth <= 1 ? 2 : 1))
      .attr('fill', d => (d.depth <= 1 ? 'white' : '#FF5C73'))
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => this.config.nodeSizes[d.depth]);

    this.g.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data([nodes.find(n => n.depth === 0)])
      .enter()
      .append('text')
      .text(d => d.name)
      .attr('dx', d => d.x)
      .attr('dy', d => d.y)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle');

    const charge = forceManyBody()
      .strength(-300);

    const linksForce = forceLink(links)
      .distance(d => this.config.nodeSizes[d.source.depth]
        + this.config.nodeSizes[d.target.depth]
        + 10
      )
      .strength(d => (d.source.depth === 0 || d.target.depth === 0 ? 0.1 : 0.5))
      .iterations(10);

    forceSimulation(nodes)
      .force('charge', charge)
      .force('link', linksForce)
      .force('x', forceX())
      .force('y', forceY())
      .on('tick', this.onTick.bind(this));
  }
}
