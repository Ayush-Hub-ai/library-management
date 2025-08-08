const fs = require('fs');
const path = require('path');

console.log('--- Starting Sanity Test ---');

const booksDir = path.join(__dirname, 'uploads', 'books');
const coversDir = path.join(__dirname, 'uploads', 'covers');

console.log('Checking for directory:', booksDir);

try {
  // Try to create the 'books' directory
  if (!fs.existsSync(booksDir)) {
    fs.mkdirSync(booksDir, { recursive: true });
    console.log('✅ SUCCESS: Created "books" directory.');
  } else {
    console.log('✅ SUCCESS: "books" directory already exists.');
  }

  // Try to create the 'covers' directory
  if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
    console.log('✅ SUCCESS: Created "covers" directory.');
  } else {
    console.log('✅ SUCCESS: "covers" directory already exists.');
  }
} catch (error) {
  console.error('❌ FAILED: There was an error creating a directory.', error);
}

console.log('--- Test Finished ---');