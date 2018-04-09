// Log events for Google Analytics
window.logEvent = (category = '', action = '', label = '') => {
  if (process.env.NODE_ENV === 'production') {
    if (category && action) {
      gtag('event', action, { event_category: category, event_label: label });
    }
  } else {
    console.info(`[GA] Event: ${category}, ${action}, ${label}`);
  }
};
