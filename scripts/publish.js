const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const packageJson = require('../package.json');

// Configuration - Update these values
const ITCH_USERNAME = 'Pyro979'; // Replace with your itch.io username
const ITCH_GAME = 'rtr-random-table-roller';                    // Replace with your game's identifier on itch.io
const CHANNEL = 'html5';                    // The channel to push to (html5 is common for web games)

// Paths
const buildDir = path.join(__dirname, '../build');

// Check if Butler is installed
function checkButlerInstalled() {
  try {
    execSync('C:\\_repos\\rtr\\butler\\butler.exe -V', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error('Butler is not installed or not in your PATH.');
    console.log('Please install Butler: https://itch.io/docs/butler/installing.html');
    return false;
  }
}

// Publish to itch.io
function publishToItch() {
  if (!checkButlerInstalled()) {
    process.exit(1);
  }

  console.log(`Publishing version ${packageJson.version} to itch.io...`);
  
  try {
    // The command format is: butler push [build directory] [username]/[game]:[channel]
    const butlerPath = 'C:\\_repos\\rtr\\butler\\butler.exe';
    const command = `"${butlerPath}" push "${buildDir}" ${ITCH_USERNAME}/${ITCH_GAME}:${CHANNEL} --userversion ${packageJson.version}`;
    
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    
    console.log(`\nSuccessfully published to itch.io!`);
    console.log(`Your game is available at: https://${ITCH_USERNAME}.itch.io/${ITCH_GAME}`);
  } catch (error) {
    console.error('Failed to publish to itch.io:', error.message);
    process.exit(1);
  }
}

// Execute the publish function
publishToItch();
