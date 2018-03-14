import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { forceSimulation, forceCenter, forceManyBody, forceCollide, forceX, forceY } from 'd3-force';
import { forceBounce } from 'd3-force-bounce';
import { transition } from 'd3-transition';
import { easeElasticOut } from 'd3-ease';
import { extent } from 'd3-array';
import random from 'lodash/random';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

import AbstractVisualization from 'components/Visualizations/AbstractVisualization';

export default class Homepage extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    this.config.height = this.el.offsetHeight;

    this.openDefaultTooltip = debounce(this.openDefaultTooltip, 500);

    this.setListeners();
    this.visualizationBreakpoints = this.getVisualizationBreakpoints();
    this.render();
    this.update();
  }

  setListeners() {
    // We detect if we can use passive event listeners
    let passiveSupported = false;
    try {
      window.addEventListener('test', null, Object.defineProperty(
        {},
        'passive',
        { get: () => { passiveSupported = true; } }
      ));
    } catch (err) {} // eslint-disable-line no-empty

    window.addEventListener(
      'scroll',
      throttle(this.onScroll.bind(this), 16),
      passiveSupported ? { passive: false } : false
    );

    window.addEventListener(
      'resize',
      throttle(this.onResize.bind(this), 16),
      passiveSupported ? { passive: false } : false
    );
  }

  /**
   * Event handler executed when the user scrolls in the page
   * NOTE: this callback is throttled
   */
  onScroll() {
    this.visualizationBreakpoints = this.getVisualizationBreakpoints();
    this.update();
    this.closeTooltip();
  }

  /**
   * Event handler executed when the user resizes the window
   * NOTE: this callback is throttled
   */
  onResize() {
    this.config.height = this.el.offsetHeight;
    this.closeTooltip();
    this.visualizationBreakpoints = this.getVisualizationBreakpoints();
    this.currentActiveIssue = null;
    this.reload();
    this.update();
  }

  /**
   * Return the content of the tooltip
   * @param {HTMLElement} target Target for the tooltip
   * @param {function(): any} provideCallback
   * @returns {string} HTML content
   */
  getTooltipContent(target, provideCallback) { // eslint-disable-line class-methods-use-this
    const d = select(target).datum();

    const callback = (tooltip) => {
      const closeButton = tooltip.querySelector('.js-close');
      if (closeButton) {
        closeButton.addEventListener('click', this.closeTooltip.bind(this));
      }

      const commentsContainer = tooltip.querySelector('.js-comments');
      if (commentsContainer) {
        const body = {
          query: `{ asset(url: "${d.url}") { id commentCount } }`,
          variables: null,
          operationName: null
        };

        fetch('https://talk.mofoprod.net/api/v1/graph/ql', {
          method: 'POST',
          headers: new Headers({ 'Content-type': 'application/json' }),
          body: JSON.stringify(body)
        }).then(res => res.json())
          .then(({ asset }) => {
            commentsContainer.textContent = asset.commentCount;
          })
          .catch(() => {});
      }
    };

    provideCallback(callback);

    return `
      <a href="${d.url}" class="c-single-post">
        <div class="single-post-body">
          <header class="single-post-header">
            <p class="text -link -secondary">${d.issue.name} // ${d.type}</p>
          </header>
          <div class="single-post-title">
            <p class="text -box2">${d.title}</p>
          </div>
          <div class="c-comments-band">
            <span class="comments">
              <svg class="c-icon -small"><use xlink:href="#icon-comment_icon"></use></svg>
              <span class="text js-comments">–</span>
            </span>
            <span class="reactions">
              <span class="text">${d.reactionsCount} ${this.dictionary.reactions}</span>
            </span>
          </div>
        </div>
      </a>
      <button type="button" class="close-button js-close" aria-label="${this.dictionary.close_tooltip}">
        <svg class="c-icon -medium"><use xlink:href="#icon-close_normal"></use></svg>
      </button>
    `;
  }

  /**
   * Close the tooltip
   */
  closeTooltip() { // eslint-disable-line class-methods-use-this
    // We close the tooltip, if opened
    document.querySelectorAll('.tippy-popper')
      .forEach((popper) => {
        const instance = popper._tippy; // eslint-disable-line no-underscore-dangle
        if (instance.state.visible) {
          instance.popperInstance.disableEventListeners();
          instance.hide();
        }
      });
  }

  /**
   * Opent the tooltip of the highlighted post for the active
   * issue
   * NOTE: this function is debounced
   */
  openDefaultTooltip() {
    // We open the tooltip of the highlighted circle, if any
    const highlightedCircle = this.circles
      .filter(d => d.issue.name === this.currentActiveIssue.issue && d.highlighted)
      .node();

    if (highlightedCircle) {
      highlightedCircle.dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      }));
    }
  }

  /**
   * Return the position of the issue containers relative to
   * the scroll position
   */
  getVisualizationBreakpoints() {
    const containers = document.querySelectorAll('.js-visualization');
    return Array.prototype.slice.call(containers)
      .map((container) => {
        const isMobile = this.width <= 640;
        const boundingRects = container.getBoundingClientRect();
        return {
          center: [
            isMobile
              ? this.width / 2
              : (boundingRects.x + boundingRects.width + this.width) / 2,
            window.scrollY + boundingRects.y + (boundingRects.height / 2)
          ],
          issue: container.getAttribute('data-issue')
        };
      });
  }

  /**
   * Create the simulation for the gravity effect
   * NOTE: stop and remove all the previous simulations
   */
  createGravitySimulation() {
    // We stop all the simulations
    this.simulations.forEach(sim => sim.stop());

    const maxDepth = this.nodes.map(d => d.depth)
      .reduce((res, d) => Math.max(res, d), 0);

    // We randomise the velocity of the nodes so they go
    // to different directions
    const velocityScale = scaleLinear()
      .domain([0, 1])
      .range([0.1, 1.5]);

    this.nodes.forEach((node) => {
      /* eslint-disable no-param-reassign */
      node.vx = velocityScale(Math.random()) * (Math.random() > 0.5 ? -1 : 1);
      node.vy = velocityScale(Math.random()) * (Math.random() > 0.5 ? -1 : 1);
      /* eslint-enable no-param-reassign */
    });

    this.simulations = [];
    // eslint-disable-next-line no-plusplus
    for (let i = maxDepth, j = 0; i >= j; i--) {
      const simulation = forceSimulation(this.nodes.filter(n => n.depth === i))
        .velocityDecay(0)
        .alphaDecay(0)
        .force('charge', forceManyBody().strength(-0.1 * ((maxDepth - i) / 2)).distanceMax(d => d.r))
        // .force('x', forceX(this.visualizationBreakpoints[0].center[0]).strength(0.0001))
        // .force('y', forceY(this.visualizationBreakpoints[0].center[1]).strength(0.0001))
        // .force('charge', forceManyBody().strength((maxDepth - i) / 2))
        .force('center', forceCenter(...this.visualizationBreakpoints[0].center))
        .force('bounce', forceBounce().radius(d => d.r))
        .on('tick', () => {
          this.circles
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        });

      this.simulations.push(simulation);

      // We display all the circles again
      const radiusTransition = transition()
        .duration(750)
        .ease(easeElasticOut);

      this.circles
        .attr('title', null)
        .style('cursor', 'default')
        .transition(radiusTransition)
        .attr('r', d => d.r);
    }
  }

  /**
   * Create the simulation for a specific issue
   * @param {string} issueName Name of the issue
   * NOTE: stop and remove all the previous simulations
   */
  createIssueSimulation(issueName) {
    // We stop all the simulations
    this.simulations.forEach(sim => sim.stop());

    // And we create a new one just for the active issue
    const simulation = forceSimulation(this.nodes.filter(n => n.depth === 0))
      .alphaDecay(0.01)
      .velocityDecay(0.4)
      .force('x', forceX(this.visualizationBreakpoints[0].center[0]))
      .force('y', forceY(this.visualizationBreakpoints[0].center[1]))
      .force('charge', forceManyBody().strength(10))
      .force('collide', forceCollide(d => (d.issue.name === issueName ? d.r : 0)).strength(1).iterations(50))
      .on('tick', () => {
        this.circles
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
      });

    this.simulations = [simulation];

    // We hide all the circles that don't belong to the issue
    const radiusTransition = transition()
      .duration(750)
      .ease(easeElasticOut);

    this.circles
      .attr('title', d => d.issue.name)
      .style('cursor', 'pointer')
      .transition(radiusTransition)
      .attr('r', d => (d.issue.name === issueName && d.depth === 0 ? d.r : 0));
  }

  render() {
    this.svg = select(this.el).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('role', 'img');

    const blurDeviations = [3, 6, 9];
    blurDeviations.forEach((blurDeviation, i) => {
      this.svg.append('filter')
        .attr('id', `blur-${i}`)
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%')
        .append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', blurDeviation);
    });

    const issues = window.POSTS.map(({ issue, color }) => ({
      name: issue,
      color
    })).filter((issue, index, arr) => arr.findIndex(i => i.name === issue.name) === index);

    const radiusScale = scaleLinear()
      .domain(extent(window.POSTS, p => p.reactionsCount))
      .range([20, 40]);

    const realNodes = window.POSTS
      .map((d, i) => ({
        index: i,
        x: random(0, this.width),
        y: random(0, this.height),
        r: radiusScale(d.reactionsCount),
        depth: 0,
        issue: { name: d.issue, color: d.color },
        title: d.title,
        type: d.type,
        url: d.url,
        reactionsCount: d.reactionsCount,
        highlighted: d.highlighted
      }));

    const randomNodes = new Array(10)
      .fill(0)
      .map((_, i) => ({
        index: realNodes.length + i,
        x: random(0, this.width),
        y: random(0, this.height),
        r: random(20, 40),
        depth: random(1, blurDeviations.length - 1),
        issue: issues[random(0, issues.length - 1)]
      }));

    this.nodes = realNodes
      .concat(randomNodes)
      .sort((n1, n2) => n2.depth - n1.depth);

    this.circles = this.svg.append('g')
      .attr('class', 'circles')
      .selectAll('circle')
      .data(this.nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.r)
      .attr('filter', (d, i) => (d.depth === 0 ? '' : `url(#blur-${i})`))
      .attr('fill', d => d.issue.color);

    if (!this.simulations) {
      this.simulations = [];
    }

    this.createGravitySimulation();
  }

  update() {
    const activeIssue = this.visualizationBreakpoints.find(b => b.center[1] > window.scrollY)
      || this.visualizationBreakpoints[this.visualizationBreakpoints.length - 1];

    if (!this.currentActiveIssue || activeIssue.issue !== this.currentActiveIssue.issue) {
      // We hide all the tooltips
      if (this.tippy) this.tippy.destroyAll();

      if (activeIssue.issue) {
        this.createIssueSimulation(activeIssue.issue);

        // We instantiate the tooltip
        this.tippy = this.instantiateTooltip('circle', 'click', '-homepage-vis');
      } else {
        this.createGravitySimulation();
      }
    }

    this.currentActiveIssue = activeIssue;

    // If there's an active issue, then we open the tooltip of
    // the highlighted post
    if (activeIssue.issue) {
      this.openDefaultTooltip();
    }
  }
}
