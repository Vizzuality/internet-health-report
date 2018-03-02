import Bar from 'components/Visualizations/Bar';
import Line from 'components/Visualizations/Line';
import Area from 'components/Visualizations/Area';
import Circle from 'components/Visualizations/Circle';
import Wikipedia from 'components/Visualizations/Wikipedia';
import Map from 'components/Visualizations/Map';

export default class Visualization {
  constructor(container, options) {
    switch (options.type) {
      case 'bar':
        return new Bar(container, options);

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
