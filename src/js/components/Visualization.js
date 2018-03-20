import Bar from 'components/Visualizations/Bar';
import StackedBar from 'components/Visualizations/StackedBar';
import Line from 'components/Visualizations/Line';
import Area from 'components/Visualizations/Area';
import Circle from 'components/Visualizations/Circle';
import Wikipedia from 'components/Visualizations/Wikipedia';
import Map from 'components/Visualizations/Map';
import AppUnhappiness from 'components/Visualizations/AppUnhappiness';
import WebLiteracyCrosswalk from 'components/Visualizations/WebLiteracyCrosswalk';

const vis = {
  bar: Bar,
  'stacked-bar': StackedBar,
  line: Line,
  area: Area,
  circle: Circle,
  map: Map,

  // Custom vis
  wikipedia: Wikipedia,
  'app-unhappiness': AppUnhappiness,
  'web-literacy-crosswalk': WebLiteracyCrosswalk
};

export default class Visualization {
  constructor(container, options) {
    switch (options.type) {
      case 'bar':
        return new Bar(container, options);

      case 'stacked-bar':
        return new StackedBar(container, options);

      case 'line':
        return new Line(container, options);

      case 'area':
        return new Area(container, options);

      case 'circle':
        return new Circle(container, options);

      case 'wikipedia':
        return new Wikipedia(container, options);

      case 'map':
        return new Map(container, options);

      case 'TODO':
        // eslint-disable-next-line no-param-reassign
        container.textContent = 'Visualization not implemented yet';
        return null;

      default:
        console.error('Unsupported visualization');
    }
  }
}
