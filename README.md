# Holded Time Tracker Extension

This browser extension automatically adds the current timer value to your total worked time and updates it every minute.

## Table of Contents

- [Project Structure](#project-structure)
- [Building the Extensions](#building-the-extensions)
- [Installation](#installation)
  - [Chrome Installation](#chrome-installation)
  - [Firefox Installation](#firefox-installation)
- [How it Works](#how-it-works)
- [Development](#development)
- [License](#license)
- [Troubleshooting](#troubleshooting)

## The Problem

In Holded's time tracking:

- The running timer is not included in your total worked time
- You only see the accumulated time from previously stopped timers
- To get an accurate total, you must stop the timer

## The Solution

This extension:

- Automatically adds the current timer value to your total worked time
- Updates the total every minute as the timer runs
- Works silently in the background without requiring interaction
- Gives you an accurate real-time view of your total worked hours

## Features

- Automatically adds current timer value to total worked time
- Updates the total every minute
- Works within Holded's iframe structure
- Persists across page refreshes
- Runs automatically without requiring user interaction

## Project Structure

This project is organized to support both Chrome and Firefox browsers with a webpack-based build system:

```plaintext
holded-time-tracker/
├── src/                     # Source code
│   ├── common/              # Shared code between both extensions
│   │   ├── icons/           # Shared icons
│   │   └── core-logic.js    # Shared business logic
│   ├── chrome/              # Chrome-specific files
│   │   ├── manifest.json    # Chrome manifest (V3)
│   │   ├── background.js    # Chrome background script
│   │   └── content.js       # Chrome content script
│   └── firefox/             # Firefox-specific files
│       ├── manifest.json    # Firefox manifest (V2)
│       ├── background.js    # Firefox background script
│       └── content.js       # Firefox content script
├── build/                   # Build scripts
│   ├── build-chrome.js      # Script to build Chrome extension
│   └── build-firefox.js     # Script to build Firefox extension
├── scripts/                 # Packaging scripts
│   ├── package-chrome.js    # Script to package Chrome extension
│   └── package-firefox.js   # Script to package Firefox extension
├── dist/                    # Build output
│   ├── chrome/              # Chrome build output
│   └── firefox/             # Firefox build output
├── webpack.chrome.config.js # Webpack config for Chrome
├── webpack.firefox.config.js # Webpack config for Firefox
└── README.md                # Project documentation
```

## Building the Extensions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Install dependencies

```bash
npm install
```

### Build Instructions

1. Build both extensions:

   ```bash
   npm run build
   ```

   Or build individually:

   ```bash
   npm run build:chrome
   npm run build:firefox
   ```

2. Package the extensions for distribution:

   ```bash
   npm run package
   ```

   Or package individually:

   ```bash
   npm run package:chrome
   npm run package:firefox
   ```

The built extensions will be available in the `dist` directory:

- `dist/chrome/` - Chrome extension files
- `dist/firefox/` - Firefox extension files

The packaged zip files will be available at:

- `dist/holded-time-tracker-chrome.zip`
- `dist/holded-time-tracker-firefox.zip`

## Installation

### Chrome Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right corner
3. Click "Load unpacked"
4. Select the `dist/chrome` directory
5. The extension will automatically start working when you visit Holded

### Firefox Installation

1. https://addons.mozilla.org/en-US/firefox/addon/holded-time-tracker/

#### Firefox Installation (temporary)

1. Open Firefox (version 58.0 or later) and go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Navigate to the `dist/firefox` directory and select the `manifest.json` file
4. The extension will automatically start working when you visit Holded

## How it Works

The extension:

1. Automatically detects when you're on a Holded page
2. Waits for the time tracking interface to load
3. Adds the current timer value to your total on first run
4. Updates the total every minute with the time difference

## Development

### Making Changes

1. Modify the browser-specific files in the `src/chrome/` or `src/firefox/` directories
2. For shared functionality, update the `src/common/core-logic.js` file
3. Rebuild the extensions using `npm run build`

### Code Structure

- `core-logic.js`: Contains shared business logic for time tracking
- Browser-specific content scripts: Import and use the shared logic
- Background scripts: Handle extension lifecycle events

### Versioning

This project uses [Semantic Versioning](https://semver.org/) (SemVer) for all version numbers. When releasing a new version, you need to update the version number in three files:

- `package.json`
- `src/chrome/manifest.json`
- `src/firefox/manifest.json`

To simplify this process, use the provided version update script:

```bash
# Update to version 1.1.0
npm run version 1.1.0
```

This script will:

1. Update all three files with the full semantic version (e.g., 1.1.0)
2. Validate that the version follows the SemVer format (X.Y.Z)
3. Remind you to create a git tag for the release

Following semantic versioning principles:

- MAJOR version (X) for incompatible API changes
- MINOR version (Y) for new functionality in a backward compatible manner
- PATCH version (Z) for backward compatible bug fixes

### Automated Releases

This project uses GitHub Actions to automate the release process:

1. Create and push a new tag with the version number:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. GitHub Actions will automatically:
   - Build both Chrome and Firefox extensions
   - Package them into zip files
   - Create a GitHub release with the zip files attached
   - Add installation instructions to the release notes

The workflow is defined in `.github/workflows/release.yml`.

## Troubleshooting

If the extension stops working:

1. Check if it's enabled in your browser's extensions
2. Try refreshing the Holded page
3. If issues persist, disable and re-enable the extension
4. Check the browser console for any error messages (F12 > Console)

## License

MIT
