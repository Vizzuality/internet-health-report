import HomepageVis from 'components/Visualizations/Homepage';
import SmoothScroll from 'smooth-scroll';

export default class HomePage {
  constructor(_, { baseUrl }) {
    this.baseUrl = baseUrl;
    this.instantiateVisualization();
    this.setAnchors();
  }
  instantiateVisualization() { // eslint-disable-line class-methods-use-this
    const el = document.createElement('div');
    el.classList.add('c-homepage-vis');
    document.body.appendChild(el);
    new HomepageVis(el, {}); // eslint-disable-line no-new
  }

  setAnchors() { // eslint-disable-line class-methods-use-this
    const scroll = new SmoothScroll();
    const homeLinks = document.querySelectorAll('.home-index-item > a');

    homeLinks.forEach(link => link.addEventListener('click', (e) => {
      e.preventDefault();
      const destiny = link.getAttribute('href');
      const destinyElement = document.querySelector(destiny);

      if (!destinyElement) return;

      scroll.animateScroll(destinyElement, null, {
        offset: ((window.innerHeight / 2) - (destinyElement.clientHeight / 2))
      });
    }));
  }
}
