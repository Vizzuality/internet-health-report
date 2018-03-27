import textures from 'textures';

export default {
  vis_1_1: {
    type: 'map',
    categorical: true
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
    patterns: (_, p) => {
      const whiteLinesA = textures.lines()
        .orientation('1/8')
        .size(10)
        .lighter()
        .stroke('#000')
        .background('#fff');

      const patterns = p.slice(0);
      patterns.splice(1, 1);

      return [whiteLinesA].concat(patterns);
    }
  },
  vis_1_4: {
    type: 'wikipedia'
  },
  vis_2_1_1: {
    type: 'line',
    valueFormat: '.0%',
    valueAxisSize: 35,
    lineStyles: (color, lineStyles) => ([
      [
        { dasharray: '0, 0', stroke: 3, linecap: 'butt', color: '#000' },
        { dasharray: '2, 10', stroke: 7, linecap: 'butt', color: '#000' }
      ]
    ].concat(lineStyles))
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
    type: 'gender-ethnic-diversity',
    bars: ['Female'],
    lines: ['White', 'Asian', 'Latino', 'Black', 'Multi', 'Other', 'Undeclared'],
    orderBy: 'Company',
    colors: {
      Female: '#c1d1ef',
      White: '#f29833',
      Asian: '#4d961d',
      Latino: '#9b3999',
      Black: '#3f99c6',
      Multi: '#dd4476',
      Other: '#65aa03',
      Undeclared: '#b8302e'
    },
    height: 800,
    radius: 700
  },
  vis_2_5_1: {
    type: 'bar',
    direction: 'vertical',
    valueFormat: (v) => {
      const value = v * 100;
      return `${Math.floor(value) + (Math.round((value % 1) * 100) / 100)}%`;
    },
    valueAxisSize: 25,
    rules: [0.02]
  },
  vis_2_5_2: {
    type: 'bar',
    direction: 'horizontal',
    labelAxisSize: 45,
    valueFormat: (v) => {
      const value = v * 100;
      return `${Math.floor(value) + (Math.round((value % 1) * 100) / 100)}%`;
    },
    valueSize: 45
  },
  vis_3_1_2: {
    type: 'map',
    categorical: true
  },
  vis_3_2_1: {
    type: 'pie',
    valueFormat: (v) => {
      const value = v * 100;
      return `${Math.floor(value) + (Math.round((value % 1) * 100) / 100)}%`;
    }
  },
  vis_3_2_2: {
    type: 'pie',
    valueFormat: (v) => {
      const value = v * 100;
      return `${Math.floor(value) + (Math.round((value % 1) * 100) / 100)}%`;
    }
  },
  vis_3_3_1: {
    type: 'bar',
    direction: 'horizontal',
    height: 1000,
    labelAxisSize: 125,
    valueFormat: (v) => {
      const value = v / 1e6;
      return Math.floor(value) + (Math.round((value % 1) * 100) / 100);
    },
    valueSize: 40
  },
  vis_3_3_2: {
    type: 'bar',
    direction: 'vertical',
    valueFormat: (v) => {
      const value = v / 1e6;
      return Math.floor(value) + (Math.round((value % 1) * 100) / 100);
    }
  },
  vis_3_4_1: {
    type: 'pie',
    valueFormat: (v) => {
      const value = v * 100;
      return `${Math.floor(value) + (Math.round((value % 1) * 100) / 100)}%`;
    }
  },
  vis_3_4_2: {
    type: 'pie',
    valueFormat: (v) => {
      const value = v * 100;
      return `${Math.floor(value) + (Math.round((value % 1) * 100) / 100)}%`;
    }
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
    valueFormat: '.0%',
    valueSize: 30,
    legend: false
  },
  vis_4_4_2: {
    type: 'bar',
    direction: 'horizontal',
    valueFormat: '.0%',
    valueSize: 30,
    labelAxisSize: 100,
    legend: false
  },
  vis_4_5_1: {
    type: 'bar',
    direction: 'vertical'
  },
  vis_4_5_2: {
    type: 'stacked-bar',
    direction: 'vertical',
    valueFormat: '.0%',
    dynamicLabelWrapping: true,
    breakdownLegend: true,
    height: 800
  },
  vis_4_5_3: {
    type: 'bar',
    direction: 'vertical',
    valueFormat: '.0%',
    valueAxisSize: 35,
    legend: false,
    dynamicLabelWrapping: true
  },
  vis_5_1: {
    type: 'app-unhappiness',
    height: 900
  },
  vis_5_2: {
    type: 'day-on-the-web'
  },
  vis_5_4: {
    type: 'TODO'
  },
  vis_5_3: {
    type: 'TODO'
  },
  vis_5_6: {
    type: 'web-literacy-crosswalk',
    height: 800,
    padding: 20
  }
};
