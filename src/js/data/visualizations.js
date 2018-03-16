import { format } from 'd3-format';
import textures from 'textures';

export default {
  vis_1_1: {
    type: 'map'
  },
  vis_1_2_2: {
    type: 'stacked-bar',
    direction: 'vertical'
  },
  vis_1_2_3: {
    type: 'stacked-bar',
    direction: 'horizontal',
    labelAxisSize: 50,
    valueSize: 30
  },
  vis_1_3_1: {
    type: 'bar',
    direction: 'vertical',
    valueFormat: '.0%',
    valueAxisSize: 35,
    patterns: color => [
      textures.lines()
        .orientation('1/8')
        .size(10)
        .lighter()
        .stroke('#000'),
      textures.lines()
        .stroke('transparent')
        .background(color),
      textures.circles()
        .complement()
        .size(8)
        .fill('#000')
        .background(color),
      textures.circles()
        .complement()
        .size(8)
        .lighter()
        .fill('#000')
        .background(color),
      textures.lines()
        .orientation('6/8')
        .size(20)
        .lighter()
        .stroke('#000')
        .background(color),
      textures.lines()
        .orientation('2/8', '6/8')
        .size(6)
        .lighter()
        .stroke('#000')
        .background(color),
      textures.lines()
        .orientation('2/8')
        .size(4)
        .lighter()
        .stroke('#000')
        .background(color),
      textures.circles()
        .complement()
        .size(8)
        .radius(0.5)
        .fill('#000')
        .background(color)
    ]
  },
  vis_1_4: {
    type: 'wikipedia'
  },
  vis_2_1_1: {
    type: 'line',
    valueFormat: '.0%',
    valueAxisSize: 35
  },
  vis_2_1_2: {
    type: 'bar',
    direction: 'vertical',
    valueFormat: '.0%',
    valueAxisSize: 35
  },
  vis_2_1_3: {
    type: 'bar',
    direction: 'vertical'
  },
  vis_2_2: {
    type: 'line'
  },
  vis_2_3: {
    type: 'circle'
  },
  vis_2_4: {
    type: 'TODO'
  },
  vis_2_5_1: {
    type: 'bar',
    direction: 'vertical',
    valueFormat: (v) => {
      const value = v * 100;
      return `${Math.floor(value) + (+format('.2r')(value % 1))}%`;
    },
    valueAxisSize: 25
  },
  vis_2_5_2: {
    type: 'bar',
    direction: 'horizontal',
    labelAxisSize: 45,
    valueFormat: (v) => {
      const value = v * 100;
      return `${Math.floor(value) + (+format('.2r')(value % 1))}%`;
    },
    valueSize: 45
  },
  vis_3_1_2: {
    type: 'map'
  },
  vis_3_2_1: {
    type: 'TODO'
  },
  vis_3_2_2: {
    type: 'TODO'
  },
  vis_3_3_1: {
    type: 'bar',
    direction: 'horizontal',
    height: 1000,
    labelAxisSize: 125,
    valueFormat: (v) => {
      const value = v / 1e6;
      return Math.floor(value) + (+format('.2r')(value % 1));
    },
    valueSize: 40
  },
  vis_3_3_2: {
    type: 'bar',
    direction: 'vertical',
    valueFormat: (v) => {
      const value = v / 1e6;
      return Math.floor(value) + (+format('.2r')(value % 1));
    }
  },
  vis_3_4_1: {
    type: 'bar',
    direction: 'horizontal'
  },
  vis_3_4_2: {
    type: 'TODO'
  },
  vis_3_5: {
    type: 'TODO'
  },
  vis_3_6: {
    type: 'area',
    valueFormat: '.0%',
    valueAxisSize: 35
  },
  vis_3_7_1: {
    type: 'bar',
    direction: 'horizontal',
    categorical: true,
    labelAxisSize: 100
  },
  vis_3_7_2: {
    type: 'stacked-bar',
    direction: 'horizontal',
    valueFormat: '.0%',
    labelAxisSize: 45,
    valueSize: 35
  },
  vis_3_7_3: {
    type: 'line',
    valueFormat: '.0%',
    valueAxisSize: 35
  },
  vis_4_1_1: {
    type: 'line',
    valueFormat: '.0%',
    valueAxisSize: 35
  },
  vis_4_1_2: {
    type: 'map',
    valueFormat: '.0%'
  },
  vis_4_2_1: {
    type: 'area',
    valueFormat: '.0%',
    valueAxisSize: 35
  },
  vis_4_2_2: {
    type: 'TODO'
  },
  vis_4_3: {
    type: 'TODO'
  },
  vis_4_4_1: {
    type: 'bar',
    direction: 'horizontal',
    valueFormat: '.0%'
  },
  vis_4_4_2: {
    type: 'bar',
    direction: 'horizontal',
    valueFormat: '.0%'
  },
  vis_4_5_3: {
    type: 'bar',
    direction: 'vertical',
    valueFormat: '.0%',
    valueAxisSize: 35
  },
  vis_4_5_1: {
    type: 'bar',
    direction: 'vertical'
  },
  vis_5_1: {
    type: 'TODO'
  },
  vis_5_2: {
    type: 'TODO'
  },
  vis_4_5_2: {
    type: 'stacked-bar',
    direction: 'horizontal',
    valueFormat: '.0%'
  },
  vis_5_4: {
    type: 'TODO'
  },
  vis_5_3: {
    type: 'TODO'
  }
};
