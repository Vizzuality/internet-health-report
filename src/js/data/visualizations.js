import { curveBasis } from 'd3-shape';

export default {
  vis_1_5: {
    type: 'wikipedia'
  },
  vis_2_2: {
    type: 'line',
    verticalAxisSize: 20
  },
  vis_3_2_1_1: {
    type: 'bar',
    direction: 'vertical'
  },
  vis_3_5: {
    type: 'area',
    verticalAxisSize: 20,
    curve: curveBasis
  }
};
