import Bar from 'components/Visualizations/Bar';
import StackedBar from 'components/Visualizations/StackedBar';
import Line from 'components/Visualizations/Line';
import Area from 'components/Visualizations/Area';
import Circle from 'components/Visualizations/Circle';
import Wikipedia from 'components/Visualizations/Wikipedia';
import Map from 'components/Visualizations/Map';
import AppUnhappiness from 'components/Visualizations/AppUnhappiness';

const vis = {
  bar: Bar,
  'stacked-bar': StackedBar,
  line: Line,
  area: Area,
  circle: Circle,
  map: Map,

  // Custom vis
  wikipedia: Wikipedia,
  'app-unhappiness': AppUnhappiness
};

export default class Visualization {
  constructor(container, options) {
    const Vis = vis[options.type];
    if (Vis) return new Vis(container, options);
    console.error('Unsupported visualization');
    return null;
  }
}
