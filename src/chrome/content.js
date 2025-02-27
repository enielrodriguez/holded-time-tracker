/**
 * Holded Time Tracker - Chrome Extension
 * 
 * This extension solves a critical limitation in Holded's time tracking:
 * Holded doesn't add the currently running timer to your total worked time
 * until you manually stop the timer. This extension automatically adds the
 * current timer value to your total and updates it every minute.
 */

import { 
  initialize,
  updateWorkedTime,
  startTracker,
  setupIframeObserver,
  checkForIframe
} from '../common/core-logic';

// State variables
const state = {
  previousTime: null,
  isFirstRun: true,
  updateInterval: null,
  iframeCheckInterval: null,
  observingIframe: false,
  isInitialized: false
};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkIfActive") {
    sendResponse({ status: "active" });
  }
  return true; // Keep the message channel open for async responses
});

// Initialize when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initialize(state));
} else {
  initialize(state);
}

// Also try to initialize after a delay to catch late-loading iframes
setTimeout(() => initialize(state), 2000);

// Notify that the extension is loaded
console.debug('Holded Time Tracker extension loaded');
