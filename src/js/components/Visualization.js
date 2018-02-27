import Bar from 'components/Visualizations/Bar';
import Line from 'components/Visualizations/Line';
import Area from 'components/Visualizations/Area';
import Circle from 'components/Visualizations/Circle';
import Wikipedia from 'components/Visualizations/Wikipedia';

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

      default:
        console.error('Unsupported visualization');
    }
  }
}
