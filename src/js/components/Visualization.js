import Bar from 'components/Visualizations/Bar';

export default class Visualization {
  constructor(container, options) {
    switch (options.type) {
      case 'bar':
        return new Bar(container, options);

      default:
        console.error('Unsupported visualization');
    }
  }
}
