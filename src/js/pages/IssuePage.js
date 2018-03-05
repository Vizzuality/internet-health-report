export default class IssuePage {
  constructor(_, { baseUrl }) {
    this.baseUrl = baseUrl;
    this.setListeners();
  }

  setListeners() {
    const learnMoreButton = document.querySelector('.js-learn-more');
    if (learnMoreButton) {
      learnMoreButton.addEventListener('click', this.onToggleDescription.bind(this));
    }

    const collapseButton = document.querySelector('.js-collapse');
    if (collapseButton) {
      collapseButton.addEventListener('click', this.onToggleDescription.bind(this));
    }
  }

  /**
   * Event handler executed when the user clicks the
   * learn more or collapse button
   * @param {MouseEvent} e
   */
  onToggleDescription({ target }) { // eslint-disable-line class-methods-use-this
    const currentRow = target.closest('.row');
    const descriptionRow = document.querySelector('#description');

    if (target.classList.contains('js-learn-more')) {
      // We hide the button
      target.style.display = 'none'; // eslint-disable-line no-param-reassign

      // We show the description
      descriptionRow.style.display = '';
    } else {
      // We hide the description
      currentRow.style.display = 'none';

      // We show the button back
      const button = document.querySelector('.js-learn-more');
      if (button) {
        button.style.display = '';
      }
    }
  }
}
