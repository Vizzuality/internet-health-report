import Bar from 'components/Visualizations/Bar';
import Line from 'components/Visualizations/Line';
import Wikipedia from 'components/Visualizations/Wikipedia';

export default class Visualization {
  constructor(container, options) {
    switch (options.type) {
      case 'bar':
        return new Bar(container, options);

      case 'line':
        return new Line(container, options);

      case 'wikipedia':
        return new Wikipedia(container, options);

      default:
        console.error('Unsupported visualization');
    }
  }
}
