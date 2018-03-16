import { extent as d3Extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';

import AbstractVisualization from './AbstractVisualization';

// Mapbox is lazy-loaded (code splitting)
let mapboxgl = null;

export default class Map extends AbstractVisualization {
  constructor(el, config) {
    super(el, config);
    import(/* webpackChunkName: "mapbox" */ 'mapbox-gl')
      .then((lib) => {
        mapboxgl = lib;

        // Configuring mapbox
        mapboxgl.accessToken = process.env.MAPBOX_API_TOKEN || 'undefined';

        this.initialize();
      });
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
    this.mapContainer = document.createElement('div');
    this.mapContainer.classList.add('map-container');
    this.el.appendChild(this.mapContainer);

    return new mapboxgl.Map({
      container: this.mapContainer,
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
   * Instantiate the tooltip
   * @param {object[]} data Rendered data
   * @param {string} layerId ID of the layer
   */
  instantiateTooltip(data, layerId) {
    if (!this.tooltip) {
      this.tooltip = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 20
      });
    }

    this.map.on('mousemove', layerId, (e) => {
      const iso = e.features.length && e.features[0].properties.iso;
      const item = iso && data.find(d => d.iso === iso);
      if (item) {
        this.tooltip.setLngLat(e.lngLat)
          .setHTML(`
            <div class="c-tooltip">
              ${this.getTooltipContent(item)}
            </div>
          `)
          .addTo(this.map);
      } else {
        this.tooltip.remove();
      }
    });

    this.map.on('mouseleave', layerId, () => this.tooltip.remove());
  }

  /**
   * Return the content of the tooltip
   * @param {{ iso: string, country: string, category?: string, value: string|number }} item
   * @returns {string} HTML content
   */
  getTooltipContent(item) { // eslint-disable-line class-methods-use-this
    return `
      <div class="number">${this.valueFormat(item.value)}</div>
      <div class="note">${item.country}</div>
    `;
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

    this.instantiateTooltip(this.data, 'chloropleth');
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
    this.mapContainer.append(categorySwitcher);

    // We append the label
    const label = document.createElement('label');
    label.textContent = this.translations.map_category_switcher_label;
    label.htmlFor = `map_category_switcher_${this.id}`;
    categorySwitcher.appendChild(label);

    // We append the select element
    const select = document.createElement('select');
    select.setAttribute('id', `map_category_switcher_${this.id}`);
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

    this.instantiateTooltip(data, 'categorical-chloropleth');
  }

  render() {
    this.el.innerHTML = '';
    this.el.classList.add('v-map');

    this.el.setAttribute('role', 'img');
    this.el.setAttribute('aria-labelledby', `title_${this.id} desc_${this.id}`);

    const title = document.createElement('div');
    title.classList.add('title');
    title.setAttribute('id', `title_${this.id}`);
    title.innerText = this.title;

    const description = document.createElement('div');
    description.setAttribute('id', `desc_${this.id}`);
    description.innerText = this.description;
    description.style.display = 'none';

    this.el.appendChild(title);
    this.el.appendChild(description);

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
