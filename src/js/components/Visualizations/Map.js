import { extent as d3Extent } from 'd3-array';
import { scaleLinear, scaleOrdinal } from 'd3-scale';

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
        if (this.categorical) return;

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
   * Event handler executed when the user change the layer
   * of the map (i.e. selects a different category)
   * @param {MouseEvent} e Event
   */
  onChangeCategory({ target }) {
    this.closeTooltip();

    this.selectedCategory = target.textContent.trim();
    const filteredData = this.data.filter(d => d.category.trim() === this.selectedCategory);

    // We remove the previous layer, if any
    if (this.map.getLayer('data-layer')) {
      this.map.removeLayer('data-layer');
    }

    this.renderDataLayer(filteredData);
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
      zoom: 1,
      maxZoom: 3,
      attributionControl: false,
      renderWorldCopies: true,
      scrollZoom: false
    });
  }

  /**
   * Instantiate the tooltip of the map
   * @param {object[]} data Rendered data
   * @param {string} layerId ID of the layer
   */
  instantiateMapTooltip(data, layerId) {
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
              ${this.getMapTooltipContent(item)}
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
  getMapTooltipContent(item) { // eslint-disable-line class-methods-use-this
    return `
      <div class="number">${this.categorical ? item.value : this.valueFormat(item.value)}</div>
      <div class="note">${item.country}</div>
    `;
  }

  /**
   * Return the content of the tooltip used to select a layer
   * @param {HTMLElement} target Target for the tooltip
   * @param {function(): any} provideCallback
   * @returns {string} HTML content
   */
  getTooltipContent(_, provideCallback) {
    const categories = this.data.map(d => d.category)
      .filter((c, i, cats) => cats.indexOf(c) === i);

    const callback = (tooltip) => {
      tooltip.addEventListener('click', (e) => {
        if (e.target.classList.contains('js-category')) {
          this.onChangeCategory(e);
        }
      });
    };

    provideCallback(callback);

    return `
      <div class="map-categories">
        ${categories.map(c => `
          <div class="text${this.selectedCategory === c.trim() ? ' -active' : ''} js-category">
            ${c}
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Create the legend
   * @param {any} options
   */
  createLegend(options) {
    // If the legend has already been created, we re-create it
    if (this.legendContainer) {
      this.mapContainer.removeChild(this.legendContainer);
    }

    this.legendContainer = document.createElement('div');
    this.legendContainer.classList.add('legend-container');
    this.mapContainer.append(this.legendContainer);

    const switcher = document.createElement('div');
    switcher.classList.add('category-switcher');
    this.legendContainer.appendChild(switcher);

    if (this.selectedCategory) {
      switcher.innerHTML = `
        <div class="label js-label" title="${this.translations.map_category_switcher_label}">
          <span class="text">
            ${this.selectedCategory}
          </span>
        </div>
      `;

      this.instantiateTooltip('.js-label', 'click', false);
    }

    const legend = document.createElement('div');
    legend.classList.add('legend');
    this.legendContainer.appendChild(legend);

    if (!this.categorical) {
      legend.classList.add('-linear');
      legend.innerHTML = `
        <div>
          <div class="text">
            <span>${options.min}</span>
            <span>${options.max}</span>
          </div>
          <div class="box -gradient" style="background: ${this.color}"></div>
        </div>
        <div>
          <div class="text">${this.noDataLabel}</div>
          <div class="box -no-data"></div>
        </div>
      `;
    } else {
      legend.classList.add('-categorical');
      legend.innerHTML = `
        ${options.opacityScale.domain().map(v => `
          <div class="text">
            <div class="box" style="background: ${this.color};">
              <div style="background: rgba(255, 255, 255, ${1 - options.opacityScale(v)});"></div>
            </div> ${v}
          </div>
        `).join('')}
        <div class="text">
          <div class="box -no-data"></div> ${this.noDataLabel}
        </div>
      `;
    }
  }

  /**
   * Return the issue's color in RGB
   * @return {number[]}
   */
  getRGBColor() {
    // Example: #0033FF
    if (this.color.length === 7) {
      const matches = this.color.match(/#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i);
      matches.shift();
      return matches.map(hex => parseInt(hex, 16));
    }

    // Example: #03F
    const matches = this.color.match(/#([0-9A-F])([0-9A-F])([0-9A-F])/i);
    matches.shift();
    return matches.map(hex => parseInt(`${hex}${hex}`, 16));
  }

  /**
   * Return the fill color of the countries on the map
   * The result don't use the alpha channel because we don't want
   * the pattern from the countries with no value to show
   * @param {number} opacity Opacity between 0 and 1
   */
  getFillColor(opacity) {
    const color = this.getRGBColor();
    const mix = c => Math.round((c * opacity) + (255 * (1 - opacity)));
    return `rgb(${mix(color[0])}, ${mix(color[1])}, ${mix(color[2])})`;
  }

  /**
   * Add the data layer to the map
   * @param {any[]} data Data
   */
  renderDataLayer(data) {
    let opacityScale;
    if (this.categorical) {
      const values = data.map(d => d.value)
        .filter((d, i, arr) => arr.indexOf(d) === i);

      opacityScale = scaleOrdinal()
        .domain(values)
        .range(values.map((_, i) => i * (1 / (values.length - 1))).reverse());
    } else {
      const extent = d3Extent(data, d => d.value);
      opacityScale = scaleLinear()
        .domain(extent)
        .range([0, 1]);
    }

    const fillColor = ['match', ['get', 'iso']];
    data.forEach(d => fillColor.push(d.iso, this.getFillColor(opacityScale(d.value))));
    fillColor.push('transparent');

    // When the map is created, it contains many layers
    // corresponding to the styles
    // To add ours behind them, we just place them below
    // the second one. The first one contains the pattern
    // for the countries with no data.
    const firstLayerId = this.map.getStyle().layers[1].id;

    this.map.addLayer({
      id: 'data-layer',
      type: 'fill',
      source: 'countries',
      'source-layer': 'cartodb-query-dljbj5',
      paint: {
        'fill-color': fillColor
      }
    }, firstLayerId);

    this.createLegend(this.categorical
      ? { opacityScale }
      : {
        min: this.valueFormat(opacityScale.domain()[0]),
        max: this.valueFormat(opacityScale.domain()[1])
      }
    );

    this.instantiateMapTooltip(data, 'data-layer');
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

      if (this.data[0].category) {
        const categories = this.data.map(d => d.category)
          .filter((c, i, cats) => cats.indexOf(c) === i);

        if (!this.selectedCategory) {
          this.selectedCategory = categories[0];
        }

        this.renderDataLayer(this.data.filter(d => d.category === this.selectedCategory));
      } else {
        this.renderDataLayer(this.data);
      }
    });
  }
}
