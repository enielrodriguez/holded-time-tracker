const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(ROOT_DIR, 'dist', 'firefox');
const ZIP_NAME = 'holded-time-tracker-firefox.zip';
const ZIP_PATH = path.join(ROOT_DIR, 'dist', ZIP_NAME);

// Check if build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  console.error('Firefox build directory does not exist. Run npm run build:firefox first.');
  process.exit(1);
}

// Create zip file
console.log('Creating Firefox extension zip file...');
if (fs.existsSync(ZIP_PATH)) {
  fs.unlinkSync(ZIP_PATH);
}

try {
  execSync(`cd "${BUILD_DIR}" && zip -r "${ZIP_PATH}" ./*`);
  console.log(`Firefox extension packaged successfully: ${ZIP_PATH}`);
} catch (error) {
  console.error('Error creating zip file:', error);
  process.exit(1);
}
