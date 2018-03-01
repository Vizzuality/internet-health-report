import mapboxgl from 'mapbox-gl';
import { extent as d3Extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';

import AbstractVisualization from './AbstractVisualization';

// Configuring mapbox
mapboxgl.accessToken = process.env.MAPBOX_API_TOKEN || 'undefined';

export default class Map extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    this.initialize();
  }

  initialize() {
    this.fetchData()
      .then(() => {
        // We properly format the labels as dates and
        // the values as numbers
        this.data = this.data.map(d => Object.assign(d, {
          value: +d.value
        }));
      })
      .catch(() => {})
      .then(() => this.render());
  }

  /**
   * Create a new map instance and return it
   * @returns {any}
  */
  createMapInstance() {
    return new mapboxgl.Map({
      container: this.el,
      style: 'mapbox://styles/vizz-mozilla/cjdvvwlcu6hh92ss3hjrs8f8s',
      center: [10.282177814440729, 44.54101006950887],
      zoom: 0.8276700596335558,
      maxZoom: 2,
      attributionControl: false,
      renderWorldCopies: true,
      scrollZoom: false
    });
  }

  /**
   * Render the chloropleth map
  */
  renderChloropleth() {
    const extent = d3Extent(this.data, d => d.value);
    const scale = scaleLinear().domain(extent);
    const expression = ['match', ['get', 'iso']];
    this.data.forEach(d => expression.push(d.iso, `${interpolateYlOrRd(scale(d.value))}`));
    expression.push('rgba(0, 0, 0, 0)');

    // When the map is created, it contains many layers
    // corresponding to the styles
    // To add ours behind them, we just place them below
    // the first one
    const firstLayerId = this.map.getStyle().layers[0].id;

    this.map.addLayer({
      id: 'chloropleth',
      type: 'fill',
      source: 'countries',
      'source-layer': 'cartodb-query-dljbj5',
      paint: {
        'fill-color': expression
      }
    }, firstLayerId);
  }

  /**
   * Render the categorical chloropleth map
  */
  renderCategoricalChloropleth() {
    const categories = this.data.map(d => d.category)
      .filter((c, i, cats) => cats.indexOf(c) === i);

    // We add the category switcher
    const categorySwitcher = document.createElement('div');
    categorySwitcher.classList.add('category-switcher');
    this.el.append(categorySwitcher);

    // We append the select element
    const select = document.createElement('select');
    categorySwitcher.appendChild(select);

    // And its options
    const options = categories.map((c) => {
      const option = document.createElement('option');
      option.value = c;
      option.innerText = c;
      return option;
    });
    options.forEach(option => select.appendChild(option));

    // Each time the select's value is changed, we update the
    // active layer
    select.addEventListener('change', ({ target }) => {
      const category = target.value;
      const filteredData = this.data.filter(d => d.category === category);
      this.addCategoricalChloroplethLayer(filteredData);
    });

    // We add the layer to the map
    const filteredData = this.data.filter(d => d.category === categories[0]);
    this.addCategoricalChloroplethLayer(filteredData);
  }

  /**
   * Add the categorical chloropleth layer to the map
   * NOTE: this method makes sure only one is displayed at a time
   * @param {{}[]}} data Data
   * @returns {any}
   */
  addCategoricalChloroplethLayer(data) {
    const extent = d3Extent(data, d => d.value);
    const scale = scaleLinear().domain(extent);
    const expression = ['match', ['get', 'iso']];
    data.forEach(d => expression.push(d.iso, `${interpolateYlOrRd(scale(d.value))}`));
    expression.push('rgba(0, 0, 0, 0)');

    // We remove the previous layer, if any
    if (this.map.getLayer('categorical-chloropleth')) {
      this.map.removeLayer('categorical-chloropleth');
    }

    // When the map is created, it contains many layers
    // corresponding to the styles
    // To add ours behind them, we just place them below
    // the first one
    const firstLayerId = this.map.getStyle().layers[0].id;

    this.map.addLayer({
      id: 'categorical-chloropleth',
      type: 'fill',
      source: 'countries',
      'source-layer': 'cartodb-query-dljbj5',
      paint: {
        'fill-color': expression
      }
    }, firstLayerId);
  }

  render() {
    this.el.innerHTML = '';
    this.el.classList.add('v-map');

    // Creating map
    this.map = this.createMapInstance();

    // Creating zoom and compass control
    const nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav, 'top-left');

    this.map.on('load', () => {
      // Source needed for the layers we create below
      this.map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://vizz-mozilla.49re30fj'
      });

      if (!this.data[0].category) {
        this.renderChloropleth();
      } else {
        this.renderCategoricalChloropleth();
      }
    });
  }
}
