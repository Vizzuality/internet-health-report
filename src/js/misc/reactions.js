
const trackReactions = () => {
  const reactions = document.getElementsByClassName('reactions')[0];
  const reactionButtons = document.querySelectorAll('.reaction_button');
  let story = null;

  if (reactions) story = reactions.getAttribute('data-ga-action');

  (reactionButtons || []).forEach((reactionButton) => {
    reactionButton.addEventListener('click', (e) => {
      const reactionClass = e.currentTarget.classList[1];
      let reaction = null;

      switch (reactionClass) {
        case 'reaction_button_0':
          reaction = 'surprised';
          break;
        case 'reaction_button_1':
          reaction = 'thinking';
          break;
        case 'reaction_button_2':
          reaction = 'happy';
          break;
        case 'reaction_button_3':
          reaction = 'sad';
          break;
        case 'reaction_button_4':
          reaction = 'fired up';
          break;
        default:
          reaction = 'no-reaction';
      }

      window.logEvent('Emoticon reaction', story, reaction);
    });
  });
};

window.addEventListener('DOMContentLoaded', trackReactions);
