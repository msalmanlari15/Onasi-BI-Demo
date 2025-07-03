const fs = require('fs');
const path = require('path');

// Source and destination paths
const sourcePath = path.join(__dirname, '../../healthcare_bi_demo.db');
const destPath = path.join(__dirname, 'healthcare_bi_demo.db');

// Copy the file
try {
  fs.copyFileSync(sourcePath, destPath);
  console.log('Database file copied successfully to public folder');
} catch (err) {
  console.error('Error copying database file:', err);
}
