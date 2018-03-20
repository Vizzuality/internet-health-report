import { scaleLinear } from 'd3-scale';

function square(x) {
  return x * x;
}

function scaleRadial() {
  const linear = scaleLinear();

  function scale(x) {
    return Math.sqrt(linear(x));
  }

  scale.domain = function domain(_) {
    if (arguments.length) return (linear.domain(_), scale);
    return linear.domain();
  };

  scale.nice = function nice(count) {
    return (linear.nice(count), scale);
  };

  scale.range = function range(_) {
    if (arguments.length) return (linear.range(_.map(square)), scale);
    return linear.range().map(Math.sqrt);
  };

  scale.ticks = linear.ticks;
  scale.tickFormat = linear.tickFormat;

  return scale;
}

export default scaleRadial;
