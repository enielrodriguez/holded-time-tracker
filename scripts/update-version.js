#!/usr/bin/env node

/**
 * This script updates the version number in all relevant files:
 * - package.json
 * - src/chrome/manifest.json
 * - src/firefox/manifest.json
 * 
 * Usage: node scripts/update-version.js <new-version>
 * Example: node scripts/update-version.js 1.1.0
 */

const fs = require('fs');
const path = require('path');

// Get the new version from command line arguments
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Error: No version specified');
  console.error('Usage: node scripts/update-version.js <new-version>');
  console.error('Example: node scripts/update-version.js 1.1.0');
  process.exit(1);
}

// Validate version format (semantic versioning)
const versionRegex = /^\d+\.\d+\.\d+$/;
if (!versionRegex.test(newVersion)) {
  console.error('Error: Invalid version format');
  console.error('Version must be in the semantic versioning format: x.y.z');
  console.error('Example: 1.0.0');
  process.exit(1);
}

// Files to update
const files = [
  {
    path: path.join(__dirname, '..', 'package.json'),
    updateFn: (content) => {
      const json = JSON.parse(content);
      json.version = newVersion;
      return JSON.stringify(json, null, 2) + '\n';
    }
  },
  {
    path: path.join(__dirname, '..', 'src', 'chrome', 'manifest.json'),
    updateFn: (content) => {
      const json = JSON.parse(content);
      json.version = newVersion;
      return JSON.stringify(json, null, 2) + '\n';
    }
  },
  {
    path: path.join(__dirname, '..', 'src', 'firefox', 'manifest.json'),
    updateFn: (content) => {
      const json = JSON.parse(content);
      json.version = newVersion;
      return JSON.stringify(json, null, 2) + '\n';
    }
  }
];

// Update each file
files.forEach(file => {
  try {
    const content = fs.readFileSync(file.path, 'utf8');
    const updatedContent = file.updateFn(content);
    fs.writeFileSync(file.path, updatedContent);
    console.log(`✅ Updated ${path.relative(path.join(__dirname, '..'), file.path)} to version ${newVersion}`);
  } catch (error) {
    console.error(`❌ Error updating ${file.path}:`, error.message);
  }
});

console.log('\n🎉 Version update complete!');
console.log(`Remember to commit these changes and create a new tag: git tag v${newVersion}`);
