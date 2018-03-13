import HomepageVis from 'components/Visualizations/Homepage';

export default class HomePage {
  constructor(_, { baseUrl }) {
    this.baseUrl = baseUrl;
    this.instantiateVisualization();
  }

  instantiateVisualization() { // eslint-disable-line class-methods-use-this
    const el = document.createElement('div');
    el.classList.add('c-homepage-vis');
    document.body.appendChild(el);
    new HomepageVis(el, {}); // eslint-disable-line no-new
  }
}
