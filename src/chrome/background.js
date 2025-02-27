/**
 * Holded Time Tracker - Chrome Background Script
 * 
 * This extension solves a critical limitation in Holded's time tracking:
 * Holded doesn't add the currently running timer to your total worked time
 * until you manually stop the timer. This extension automatically adds the
 * current timer value to your total and updates it every minute.
 */

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Holded Time Tracker extension installed');
});

// We don't need to inject the content script manually since it's already
// declared in the manifest.json's content_scripts section.
// This background script is primarily for extension lifecycle management.
