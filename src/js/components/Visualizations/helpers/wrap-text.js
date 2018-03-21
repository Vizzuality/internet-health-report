import { select } from 'd3-selection';

function wrap(text, width) {
  text.each(function eachText() {
    const textElement = select(this);
    const words = textElement.text().split(/\s+/).reverse();
    const lineHeight = 1.1; // ems
    const y = textElement.attr('y');
    const dy = parseFloat(textElement.attr('dy'));

    let word;
    let line = [];
    let lineNumber = 0;
    let tspan = textElement.text(null).append('tspan').attr('x', 0).attr('y', y)
      .attr('dy', `${dy}em`);

    while ((word = words.pop())) { // eslint-disable-line no-cond-assign
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        lineNumber += 1;
        tspan = textElement.append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', `${(lineNumber * lineHeight) + dy}em`)
          .text(word);
      }
    }
  });
}

export default wrap;
