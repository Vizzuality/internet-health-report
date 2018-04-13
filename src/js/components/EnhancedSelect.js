import tippy from 'tippy.js/dist/tippy.min';

export default class EnhancedSelect {
  constructor(el, onChange = () => {}) {
    this.el = el;
    this.onChange = onChange;
    this.initialize();
  }

  initialize() {
    const div = document.createElement('div');
    div.classList.add('c-enhanced-select');
    div.setAttribute('aria-label', this.el.getAttribute('aria-label'));

    const label = document.createElement('button');
    label.setAttribute('type', 'button');
    label.classList.add('label');
    label.textContent = this.el.selectedOptions[0].textContent;

    div.appendChild(label);

    const tooltipContent = document.createElement('div');
    tooltipContent.classList.add('c-enhanced-select');

    const options = document.createElement('ul');
    options.classList.add('options');
    options.innerHTML = Array.prototype.slice.call(this.el.options).reduce((res, o) => {
      return `
        ${res}
        <li class="${this.el.selectedOptions[0] === o ? '-selected' : ''}">
          <button type="button" data-value="${o.value}">${o.textContent}</button>
        </li>
      `;
    }, '');

    options.addEventListener('click', (e) => {
      if (!e.target.matches('.options button')) return;

      label.textContent = e.target.textContent;
      this.closeTooltip();

      const option = Array.prototype.slice.call(this.el.options).find(o => `${o.value}` === e.target.getAttribute('data-value'));
      option.selected = true;

      this.onChange(option);
    });

    tooltipContent.appendChild(options);

    // We add the tooltip
    tippy(label, {
      animateFill: false,
      animation: 'shift-toward',
      inertia: true,
      theme: 'ihr',
      html: tooltipContent,
      arrow: true,
      interactive: true,
      trigger: 'click'
    });

    // We create a new parent element to the filter
    const parent = this.el.parentElement;
    parent.insertBefore(div, this.el);
    div.appendChild(this.el);
  }

  /**
   * Close the tooltip
   */
  closeTooltip() { // eslint-disable-line class-methods-use-this
    // We close the tooltip, if opened
    document.querySelectorAll('.tippy-popper')
      .forEach((popper) => {
        const instance = popper._tippy; // eslint-disable-line no-underscore-dangle
        if (instance.state.visible) {
          instance.popperInstance.disableEventListeners();
          instance.hide();
        }
      });
  }
}
