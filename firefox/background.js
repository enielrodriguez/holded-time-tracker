// Background script for Holded Time Tracker

// Listen for installation
browser.runtime.onInstalled.addListener(() => {
  console.log('Holded Time Tracker extension installed');
});

// We don't need to inject the content script manually since it's already
// declared in the manifest.json's content_scripts section.
// This background script is primarily for extension lifecycle management.
