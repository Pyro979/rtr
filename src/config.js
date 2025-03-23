// Configuration based on deployment target
const deployTarget = process.env.REACT_APP_DEPLOY_TARGET || 'local';

// Define configuration for different deployment targets
const config = {
  // Local development
  local: {
    homepage: '/'
  },
  // itch.io deployment
  itch: {
    homepage: './'
  },
  // GitHub Pages deployment
  github: {
    homepage: 'https://pyro979.github.io/rtr/'
  }
};

// Export the configuration for the current deployment target
export default config[deployTarget] || config.local;
