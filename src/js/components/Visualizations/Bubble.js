import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { forceSimulation, forceManyBody, forceCollide, forceX, forceY } from 'd3-force';
import A11yDialog from 'a11y-dialog';

import AbstractVisualization from 'components/Visualizations/AbstractVisualization';

export default class Bubble extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    this.initialize();
    this.setListeners();
  }

  initialize() {
    this.fetchData()
      .catch(() => {})
      .then(() => this.render());
  }

  getTooltipContent(target) { // eslint-disable-line class-methods-use-this
    const d = select(target).datum();
    return `
      <ol>
        ${d.categories.map(c => `<li>${c}</li>`).join('')}
      </ol>
    `;
  }

  instantiateModal(target, trigger = 'click') {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'bubble-modal';
    modalContainer.classList.add('c-modal');
    modalContainer.setAttribute('aria-hidden', 'true');

    modalContainer.innerHTML = `
      <div class="c-modal-overlay" tabindex="-1" data-a11y-dialog-hide></div>
      <div role="dialog" aria-labelledby="bubble-modal-title">
        <div role="document">
          <button type="button" class="close-button" data-a11y-dialog-hide aria-label="${this.translations.close_modal}">
            <svg class="c-icon"><use xlink:href="#icon-close_normal"></use></svg>
          </button>

          <h1 id="bubble-modal-title" class="js-title"></h1>

          <div class="content js-content"></div>
        </div>
      </div>
    `;

    this.el.appendChild(modalContainer);

    // We add the event listener
    this.el.addEventListener(trigger, (e) => {
      if (e.target.matches(target)) {
        e.preventDefault();

        const title = modalContainer.querySelector('.js-title');
        const content = modalContainer.querySelector('.js-content');

        title.textContent = e.target.getAttribute('title');
        // We re-use the function that generates the content of the
        // tooltip
        content.innerHTML = this.getTooltipContent(e.target);

        // If the modal hasn't been created yet, we do it
        if (!this.modal) {
          this.modal = new A11yDialog(modalContainer);
        }

        this.modal.show();
      }
    });
  }

  render() {
    super.render();
    if (!this.data) return;

    this.el.classList.add('v-bubble');

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

    const container = this.svg.append('g')
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

    // Marks
    const nodes = labels.map(d => ({
      x: 0,
      y: 0,
      label: d,
      categories: this.data.filter(({ label }) => label === d)
        .map(({ category }) => category)
    }));

    const radiusScale = scaleLinear()
      .domain(extent(nodes.map(n => n.categories.length)))
      .range([55, 90]);

    const bubbles = container.append('g')
      .attr('class', 'marks')
      .attr('transform', `translate(${this.visualizationBounds.x + (this.visualizationBounds.width / 2)}, ${this.visualizationBounds.y + (this.visualizationBounds.height / 2)})`)
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g');

    bubbles.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', d => radiusScale(d.categories.length))
      .attr('fill', this.color)
      .attr('title', d => d.label);

    bubbles.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dominant-baseline', 'central')
      .attr('text-anchor', 'middle')
      .text(d => d.label)
      .style('pointer-events', 'none');


    // We wrap the labels and properly center them
    const self = this;
    bubbles.selectAll('text')
      .each(function (d) { // eslint-disable-line func-names
        self.wrapText.apply(this, [select(this), radiusScale(d.categories.length) * 2, 20, 1, 0]);
      })
      .each(function () { // eslint-disable-line func-names
        const text = select(this);
        const height = this.getBBox().height;
        text.attr('transform', `translate(0, ${-(height / 4)})`);
      });

    forceSimulation(nodes)
      .alphaDecay(0.01)
      .velocityDecay(0.4)
      .force('x', forceX())
      .force('y', forceY().strength(0.4))
      .force('charge', forceManyBody().strength(10))
      .force('collide', forceCollide(d => radiusScale(d.categories.length) + 10).strength(1).iterations(50))
      .on('tick', () => {
        bubbles.attr('transform', d => `translate(${d.x}, ${d.y})`);
      });


    if (window.innerWidth <= 540) {
      this.instantiateModal('circle');
    } else {
      this.instantiateTooltip('circle');
    }
  }
}
