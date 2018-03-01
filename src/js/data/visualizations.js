import { curveBasis } from 'd3-shape';

export default {
  vis_1_2: {
    type: 'map'
  },
  vis_1_5: {
    type: 'wikipedia'
  },
  vis_2_2: {
    type: 'line',
    verticalAxisSize: 20
  },
  vis_2_3: {
    type: 'circle'
  },
  vis_3_2_1_1: {
    type: 'bar',
    direction: 'horizontal'
  },
  vis_3_5: {
    type: 'area',
    verticalAxisSize: 20,
    curve: curveBasis
  },
  vis_4_1_1: {
    type: 'map'
  }
};
