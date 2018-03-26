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

    this.openDefaultTooltip = debounce(this.openDefaultTooltip, 200);

    // We temporarily disable the homepage visualisation
    // for performance and UX reasons on smaller devices
    if (this.el.offsetWidth <= 640) {
      return;
    }

    this.setListeners();
    this.visualizationBreakpoints = this.getVisualizationBreakpoints();
    this.render();
    this.update();
  }

  setListeners() {
    super.setListeners();

    window.addEventListener(
      'scroll',
      throttle(this.onScroll.bind(this), 16),
      this.supportPassiveListeners ? { passive: false } : false
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
   * Event handler executed when the tooltip is beginning
   * to hide
   */
  onHideTooltip() {
    // We hide the faces of all the bubbles
    this.faces.attr('opacity', 0);
  }

  /**
   * Event handler executed when a circle is clicked
   * @param {any} _
   * @param {number} index Index of the circle
   */
  onClickCircle(_, index) {
    if (!this.currentActiveIssue.issue) return;

    const face = select(this.faces.nodes()[index]);
    const opacity = face.attr('opacity'); // Don't move in the setTimeout

    // We use a timeout of 0 to make sure we already
    // have hidden all the faces in onHideTooltip
    setTimeout(() => {
      // We toggle the opacity of the face
      face.attr('opacity', opacity === '0' ? 1 : 0);
    }, 0);
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

      // NOTE: temporarily hidden until we figure out how to fetch
      // the number of comments
      // const commentsContainer = tooltip.querySelector('.js-comments');
      // if (commentsContainer) {
      //   const body = {
      //     query: `{ asset(url: "${d.url}") { id commentCount } }`,
      //     variables: null,
      //     operationName: null
      //   };

      //   fetch('https://talk.mofoprod.net/api/v1/graph/ql', {
      //     method: 'POST',
      //     headers: new Headers({ 'Content-type': 'application/json' }),
      //     body: JSON.stringify(body)
      //   }).then(res => res.json())
      //     .then(({ asset }) => {
      //       commentsContainer.textContent = asset.commentCount;
      //     })
      //     .catch(() => {});
      // }
    };

    provideCallback(callback);

    return `
      <a href="${d.url}" class="c-single-post">
        <div class="single-post-body${d.image ? ' -image' : ''}">
          <header class="single-post-header">
            <p class="text -link -secondary">${d.issue.name} // ${d.type}</p>
          </header>
          <div class="single-post-title">
            <p class="text -box2">${d.title}</p>
          </div>
          <div class="c-comments-band">
            <span class="comments">
            </span>
            <span class="reactions">
              <div class="c-reactions-icon">
                <div class="reaction">
                  <svg><use xlink:href="${this.getFaceIconHref(d.reactions[1] || 'Happy', null)}"></use></svg>
                </div>
                <div class="reaction" style="background-color: ${d.issue.color};">
                  <svg><use xlink:href="${this.getFaceIconHref(d.reactions[0] || 'Happy', null)}"></use></svg>
                </div>
              </div>
              <span class="text">${d.reactionsCount} ${this.translations.reactions}</span>
            </span>
          </div>
        </div>
        ${d.image ? `<div class="single-post-image" style="background-image:url('${d.image}')"></div>` : ''}
      </a>
      <button type="button" class="close-button js-close" aria-label="${this.translations.close_tooltip}">
        <svg class="c-icon -medium"><use xlink:href="#icon-close_normal"></use></svg>
      </button>
    `;
  }

  /**
   * Return the highlighted bubble for the active issue
   * @returns {any} d3 element
   */
  getHighlightedBubble() {
    return this.bubbles
      .filter(d => d.issue.name === this.currentActiveIssue.issue && d.highlighted);
  }

  /**
   * Opent the tooltip of the highlighted post for the active
   * issue
   * NOTE: this function is debounced
   */
  openDefaultTooltip() {
    // We open the tooltip of the highlighted circle, if any
    const highlightedBubble = this.getHighlightedBubble();

    if (highlightedBubble.node()) {
      highlightedBubble.select('circle').node().dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      }));
    }
  }

  /**
   * Return the href link to the reaction's icon
   * @param {string} reactionName Name of the reaction
   * @param {string} [size='big'] Size of the icon
   */
  getFaceIconHref(reactionName, size = 'big') { // eslint-disable-line class-methods-use-this
    let reaction = reactionName.trim().toLowerCase();
    if (reaction === 'fired up') {
      reaction = 'angry';
    }

    return `#icon-${reaction}${size ? `-${size}` : ''}-reaction`;
  }

  /**
   * Return the position of the issue containers relative to
   * the scroll position
   */
  getVisualizationBreakpoints() {
    const containers = document.querySelectorAll('.js-visualization');
    return Array.prototype.slice.call(containers)
      .map((container) => {
        const isMobile = this.el.offsetWidth <= 640;
        const boundingRects = container.getBoundingClientRect();
        return {
          center: [
            isMobile
              ? this.el.offsetWidth / 2
              : (boundingRects.x + boundingRects.width + this.el.offsetWidth) / 2,
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
          this.bubbles.attr('transform', d => `translate(${d.x}, ${d.y})`);
        });

      this.simulations.push(simulation);

      // We display all the circles again
      const radiusTransition = transition()
        .duration(750)
        .ease(easeElasticOut);

      this.bubbles
        .style('cursor', 'default');

      this.circles
        .attr('title', null)
        .transition(radiusTransition)
        .attr('r', d => d.r);

      this.faces
        .transition(radiusTransition)
        .attr('x', d => -d.r)
        .attr('y', d => -d.r)
        .attr('width', d => d.r * 2)
        .attr('height', d => d.r * 2);
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
        this.bubbles.attr('transform', d => `translate(${d.x}, ${d.y})`);
      });

    this.simulations = [simulation];

    // We hide all the circles that don't belong to the issue
    const radiusTransition = transition()
      .duration(750)
      .ease(easeElasticOut);

    const clampedRadiusTransition = transition()
      .duration(750)
      .ease(t => Math.min(1, easeElasticOut(t))); // We avoid sizes below 0

    this.bubbles
      .style('cursor', 'pointer');

    const willDisappear = d => d.issue.name !== issueName || d.depth !== 0;

    this.circles
      .filter(d => willDisappear(d))
      .attr('title', d => d.issue.name)
      .transition(clampedRadiusTransition)
      .attr('r', 0);

    this.circles
      .filter(d => !willDisappear(d))
      .attr('title', d => d.issue.name)
      .transition(radiusTransition)
      .attr('r', d => d.r);

    this.faces
      .filter(d => willDisappear(d))
      .transition(clampedRadiusTransition)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', 0);

    this.faces
      .filter(d => !willDisappear(d))
      .transition(clampedRadiusTransition)
      .attr('x', d => -1 * d.r)
      .attr('y', d => -1 * d.r)
      .attr('width', d => d.r * 2)
      .attr('height', d => d.r * 2);
  }

  render() {
    this.svg = select(this.el).append('svg')
      .attr('width', this.el.offsetWidth)
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
        x: random(0, this.el.offsetWidth),
        y: random(0, this.height),
        r: radiusScale(d.reactionsCount),
        depth: 0,
        issue: { name: d.issue, color: d.color },
        title: d.title,
        type: d.type,
        url: d.url,
        reactionsCount: d.reactionsCount,
        highlighted: d.highlighted,
        reactions: d.reactions,
        image: d.image
      }));

    const randomNodes = new Array(10)
      .fill(0)
      .map((_, i) => ({
        index: realNodes.length + i,
        x: random(0, this.el.offsetWidth),
        y: random(0, this.height),
        r: random(20, 40),
        depth: random(1, blurDeviations.length - 1),
        issue: issues[random(0, issues.length - 1)]
      }));

    this.nodes = realNodes
      .concat(randomNodes)
      .sort((n1, n2) => n2.depth - n1.depth);

    this.bubbles = this.svg.append('g')
      .attr('class', 'bubbles')
      .selectAll('g')
      .data(this.nodes)
      .enter()
      .append('g')
      .attr('class', 'bubble');

    // NOTE: the click event can't be attached to the
    // bubbles because the browsers (and especially Safari)
    // don't compute their size correctly (because of the
    // <use> tag)
    // The event can only be attached to the circles, but as
    // the faces are above it, we need to remove the pointer
    // events from them

    this.circles = this.bubbles.append('circle')
      .attr('r', d => d.r)
      .attr('filter', d => (d.depth === 0 ? '' : `url(#blur-${d.depth})`))
      .attr('fill', d => d.issue.color)
      .on('click', this.onClickCircle.bind(this));

    this.faces = this.bubbles.append('use')
      .attr('xlink:href', d => this.getFaceIconHref((d.reactions && d.reactions[0]) || 'Happy'))
      .attr('x', d => -d.r)
      .attr('y', d => -d.r)
      .attr('width', d => d.r * 2)
      .attr('height', d => d.r * 2)
      .attr('opacity', 0)
      .style('pointer-events', 'none');

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
      if (this.tippy) {
        this.tippy.destroyAll();

        // FIXME: Tippy.js introduces a title attribute with the value "null"
        // to this.el when we call destroyAll. To prevent having a native
        // tooltip with the same value, we delete the temporary title.
        // https://github.com/atomiks/tippyjs/issues/207
        this.el.removeAttribute('title');
      }

      if (activeIssue.issue) {
        this.createIssueSimulation(activeIssue.issue);

        // We instantiate the tooltip
        this.tippy = this.instantiateTooltip('circle', 'click', true, '-homepage-vis');
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
