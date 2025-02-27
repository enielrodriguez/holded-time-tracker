/**
 * Holded Time Tracker - Core Logic
 * 
 * This extension solves a critical limitation in Holded's time tracking:
 * Holded doesn't add the currently running timer to your total worked time
 * until you manually stop the timer. This extension automatically adds the
 * current timer value to your total and updates it every minute.
 * 
 * This file contains the shared core logic used by both Chrome and Firefox versions.
 */

// Function to parse time string "hh:mm:ss" to minutes
export function parseTime(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
}

// Function to parse worked time string "xxh xxm" to total minutes
export function parseWorkedTime(workedTimeStr) {    
    try {
        const [hoursStr, minutesStr] = workedTimeStr.split(' ');
        const hours = parseInt(hoursStr?.replace('h', '') || '0', 10);
        const minutes = parseInt(minutesStr?.replace('m', '') || '0', 10);
        return (hours * 60) + minutes;
    } catch (e) {
        console.error('Error parsing worked time:', e);
        return 0;
    }
}

// Function to format total minutes to "xxh xxm"
export function formatWorkedTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
}

// Function to update the worked time
export function updateWorkedTime(state) {
    try {
        // Get the iframe document
        const iframe = document.getElementById('legacy-page');
        if (!iframe) {
            console.debug('Iframe not found, retrying...');
            return;
        }

        // Try to access the iframe content
        let iframeDoc;
        try {
            iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            
            // If we can't access the iframe content due to same-origin policy
            if (!iframeDoc) {
                console.debug('Cannot access iframe content due to same-origin policy');
                return;
            }
        } catch (e) {
            console.debug('Error accessing iframe content:', e);
            return;
        }
        
        // Find elements within the iframe
        const timeElement = iframeDoc.querySelector('[data-testid="current-time"]') || 
                           iframeDoc.querySelector('.time-display') ||
                           iframeDoc.getElementById('currentTime');
                           
        const workedHoursElement = iframeDoc.querySelector('[data-testid="worked-hours"]') ||
                                  iframeDoc.querySelector('.worked-hours') ||
                                  iframeDoc.getElementById('workedHours');

        if (!timeElement || !workedHoursElement) {
            console.debug('Required elements not found in iframe, retrying...');
            return;
        }

        const currentTime = parseTime(timeElement.innerText);
        const currentWorkedTime = parseWorkedTime(workedHoursElement.innerText);
        
        let updatedWorkedTime;
        
        if (state.isFirstRun) {
            updatedWorkedTime = currentWorkedTime + currentTime;
            console.debug('First run - Adding current time:', currentTime);
            state.isFirstRun = false;
        } else if (state.previousTime !== null) {
            const timeDifference = currentTime - state.previousTime;
            
            if (timeDifference > 0) {
                updatedWorkedTime = currentWorkedTime + timeDifference;
            } else {
                updatedWorkedTime = currentWorkedTime;
            }
        }

        if (updatedWorkedTime !== undefined) {
            workedHoursElement.innerText = formatWorkedTime(updatedWorkedTime);
        }
        
        state.previousTime = currentTime;
    } catch (error) {
        console.error('Error in updateWorkedTime:', error);
    }
}

// Function to start the tracker
export function startTracker(state) {
    if (state.updateInterval) {
        clearInterval(state.updateInterval);
    }
    
    // Try to initialize immediately
    updateWorkedTime(state);
    
    // Set up the interval for updates
    state.updateInterval = setInterval(() => updateWorkedTime(state), 60000);
    
    console.debug('Holded Time Tracker started');
}

// Set up a MutationObserver to watch for iframe changes
export function setupIframeObserver(state) {
    if (state.observingIframe) return;
    
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                const iframe = document.getElementById('legacy-page');
                if (iframe) {
                    // Wait a bit for the iframe to fully load
                    setTimeout(() => {
                        try {
                            if (iframe.contentDocument || iframe.contentWindow.document) {
                                startTracker(state);
                            }
                        } catch (e) {
                            console.debug('Iframe not ready yet:', e);
                        }
                    }, 2000);
                }
            }
        }
    });
    
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    
    state.observingIframe = true;
    console.debug('Iframe observer set up');
}

// Check for iframe periodically
export function checkForIframe(state) {
    if (state.iframeCheckInterval) {
        clearInterval(state.iframeCheckInterval);
    }
    
    state.iframeCheckInterval = setInterval(() => {
        const iframe = document.getElementById('legacy-page');
        if (iframe) {
            try {
                if (iframe.contentDocument || iframe.contentWindow.document) {
                    clearInterval(state.iframeCheckInterval);
                    startTracker(state);
                }
            } catch (e) {
                console.debug('Iframe not ready yet:', e);
            }
        }
    }, 1000);
}

// Initialize everything
export function initialize(state) {
    // Prevent multiple initializations
    if (state.isInitialized) return;
    state.isInitialized = true;
    
    console.debug('Holded Time Tracker initializing');
    setupIframeObserver(state);
    checkForIframe(state);
}
