import Bar from 'components/Visualizations/Bar';
import Wikipedia from 'components/Visualizations/Wikipedia';

export default class Visualization {
  constructor(container, options) {
    switch (options.type) {
      case 'bar':
        return new Bar(container, options);

      case 'wikipedia':
        return new Wikipedia(container, options);

      default:
        console.error('Unsupported visualization');
    }
  }
}
