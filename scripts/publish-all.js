const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

console.log(`${colors.blue}=== Starting Multi-Platform Publishing Process ===${colors.reset}\n`);

// Function to execute a command and log its output
function runCommand(command, description) {
  console.log(`${colors.yellow}${description}...${colors.reset}`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`${colors.green}✓ ${description} completed successfully${colors.reset}\n`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ ${description} failed: ${error.message}${colors.reset}\n`);
    return false;
  }
}

// Step 1: Publish to GitHub Pages
console.log(`${colors.blue}=== Publishing to GitHub Pages ===${colors.reset}`);
const ghPagesSuccess = runCommand('npm run deploy:github', 'GitHub Pages deployment');

// Step 2: Publish to itch.io
console.log(`${colors.blue}=== Publishing to itch.io ===${colors.reset}`);
const itchSuccess = runCommand('npm run publish', 'itch.io deployment');

// Summary
console.log(`${colors.blue}=== Deployment Summary ===${colors.reset}`);
console.log(`GitHub Pages: ${ghPagesSuccess ? colors.green + 'SUCCESS' : colors.red + 'FAILED'}`);
console.log(`itch.io: ${itchSuccess ? colors.green + 'SUCCESS' : colors.red + 'FAILED'}`);
console.log(colors.reset);

if (ghPagesSuccess && itchSuccess) {
  console.log(`${colors.green}All deployments completed successfully!${colors.reset}`);
  process.exit(0);
} else {
  console.log(`${colors.yellow}Some deployments failed. Check the logs above for details.${colors.reset}`);
  process.exit(1);
}
