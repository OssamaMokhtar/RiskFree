/**
 * GCC AI Credit Platform — Motion Helpers
 */

export const MotionHelper = {
  /**
   * Triggers a score meter animation for SVG arcs
   * @param {HTMLElement} pathElement - The SVG circle/path to animate
   * @param {number} score - Current score
   * @param {number} maxScore - Maximum possible score
   * @param {number} circumference - The total circumference of the circle
   */
  animateScoreMeter(pathElement, score, maxScore, circumference) {
    if (!pathElement) return;
    const percent = Math.max(0, Math.min(score / maxScore, 1));
    const offset = circumference - (percent * circumference);
    
    // Set initial state
    pathElement.style.strokeDasharray = circumference;
    pathElement.style.strokeDashoffset = circumference;
    
    // Trigger paint layout to register initial state
    pathElement.getBoundingClientRect();
    
    // Execute animation
    pathElement.style.strokeDashoffset = offset;
  },

  /**
   * Expands or collapses a table row smoothly
   * @param {HTMLElement} detailsRow - The collapsible row element
   * @param {boolean} isExpanded - Target state
   */
  toggleTableRow(detailsRow, isExpanded) {
    if (!detailsRow) return;
    if (isExpanded) {
      detailsRow.classList.add('expanded');
      detailsRow.style.padding = '16px'; // Re-add padding
    } else {
      detailsRow.classList.remove('expanded');
      detailsRow.style.padding = '0 16px'; // Remove vertical padding to allow height collapse
    }
  },

  /**
   * Triggers a toast notification animation
   * @param {HTMLElement} toastElement - The toast node
   */
  enterToast(toastElement) {
    if (!toastElement) return;
    toastElement.classList.add('toast-slide-in');
  },

  /**
   * Renders the Copilot typing indicator HTML
   * @returns {string} HTML string
   */
  getTypingIndicatorHTML() {
    return `
      <div class="typing-indicator" aria-label="Copilot is generating...">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
  }
};
