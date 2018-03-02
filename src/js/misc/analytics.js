// Log events for Google Analytics
window.logEvent = (category = '', action = '', label = '') => {
  if (process.env.NODE_ENV === 'production') {
    if (category && action) {
      ga.apply(['send', 'event', category, action, label]);
    }
  } else {
    console.info(`[GA] Event: ${category}, ${action}, ${label}`);
  }
};
