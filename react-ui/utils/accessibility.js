export const accessibility = {
  // Returns aria attributes for a button based on state
  getButtonAria: ({ label, expanded, disabled, controls }) => ({
    'aria-label': label,
    'aria-expanded': expanded !== undefined ? expanded : undefined,
    'aria-disabled': disabled,
    'aria-controls': controls,
  }),
  
  // Generic handler for keyboard events (Enter / Space)
  handleKeyboardInteraction: (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback(e);
    }
  },
};
