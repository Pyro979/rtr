const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const packageJson = require('../package.json');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Define zip file path
const zipFileName = `rtr-v${packageJson.version}.zip`;
const zipFilePath = path.join(distDir, zipFileName);

// Create a file to stream archive data to
const output = fs.createWriteStream(zipFilePath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log(`Successfully created ${zipFileName} (${archive.pointer()} bytes)`);
  console.log(`The zip file is ready at: ${zipFilePath}`);
});

// Good practice to catch warnings
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

// Good practice to catch errors
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add the build directory contents to the zip
const buildDir = path.join(__dirname, '../build');
archive.directory(buildDir, false);

// Finalize the archive
archive.finalize();
