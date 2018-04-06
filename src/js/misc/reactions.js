/* eslint-disable quote-props */
const classToReactionName = {
  'reaction_button_0': window.TRANSLATIONS.reaction_surprised,
  'reaction_button_1': window.TRANSLATIONS.reaction_thinking,
  'reaction_button_2': window.TRANSLATIONS.reaction_happy,
  'reaction_button_3': window.TRANSLATIONS.reaction_sad,
  'reaction_button_4': window.TRANSLATIONS.reaction_fired_up
};
/* eslint-enable quote-props */

window.addEventListener('DOMContentLoaded', () => {
  const reactions = document.querySelectorAll('.reaction_buttons');

  if (reactions) {
    reactions.forEach((reaction) => {
      const buttons = reaction.querySelectorAll('.reaction_button');

      buttons.forEach((button) => {
        const reactionNameContainer = button.querySelector('.button_name');
        const originalReactionName = reactionNameContainer
          ? reactionNameContainer.textContent
          : 'No reaction';
        const className = Array.prototype.slice.call(button.classList).filter(c => c !== 'reaction_button');
        const reactionName = classToReactionName[className[0]];

        // We translate the name of the reactions
        if (reactionNameContainer && reactionName) {
          reactionNameContainer.textContent = reactionName;
        }

        // We add the analytics
        button.addEventListener('click', () => {
          const container = reaction.closest('.reactions');
          if (container && !button.classList.contains('voted')) {
            const action = container.getAttribute('data-ga-action');
            window.logEvent('Emoticon reaction', action, originalReactionName);
          }
        });
      });
    });
  }
});
