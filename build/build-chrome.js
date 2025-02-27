#!/usr/bin/env node

/**
 * Build script for Chrome extension
 * 
 * This script:
 * 1. Creates a build directory
 * 2. Copies all necessary files
 * 3. Creates a zip file for distribution
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(ROOT_DIR, 'dist', 'chrome');
const CHROME_DIR = path.join(ROOT_DIR, 'chrome');
const COMMON_DIR = path.join(ROOT_DIR, 'common');
const ICONS_DIR = path.join(COMMON_DIR, 'icons');
const ICONS_DEST_DIR = path.join(BUILD_DIR, 'icons');

// Create build directory structure
console.log('Creating build directory...');
if (fs.existsSync(BUILD_DIR)) {
  fs.rmSync(BUILD_DIR, { recursive: true, force: true });
}
fs.mkdirSync(BUILD_DIR, { recursive: true });
fs.mkdirSync(ICONS_DEST_DIR, { recursive: true });

// Copy Chrome-specific files
console.log('Copying Chrome-specific files...');
fs.copyFileSync(
  path.join(CHROME_DIR, 'manifest.json'),
  path.join(BUILD_DIR, 'manifest.json')
);
fs.copyFileSync(
  path.join(CHROME_DIR, 'background.js'),
  path.join(BUILD_DIR, 'background.js')
);
fs.copyFileSync(
  path.join(CHROME_DIR, 'content.js'),
  path.join(BUILD_DIR, 'content.js')
);

// Copy icons
console.log('Copying icons...');
fs.copyFileSync(
  path.join(ICONS_DIR, 'icon48.png'),
  path.join(ICONS_DEST_DIR, 'icon48.png')
);
fs.copyFileSync(
  path.join(ICONS_DIR, 'icon128.png'),
  path.join(ICONS_DEST_DIR, 'icon128.png')
);

// Create zip file
console.log('Creating zip file...');
const zipPath = path.join(ROOT_DIR, 'dist', 'holded-time-tracker-chrome.zip');
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

try {
  execSync(`cd "${BUILD_DIR}" && zip -r "${zipPath}" ./*`);
  console.log(`Chrome extension built successfully: ${zipPath}`);
} catch (error) {
  console.error('Error creating zip file:', error);
  process.exit(1);
}
