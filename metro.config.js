// Import the getDefaultConfig function from expo/metro-config
const { getDefaultConfig } = require('expo/metro-config');

// Get the default Expo configuration
const config = getDefaultConfig(__dirname);

// Customize the config
config.watchFolders = [];
config.resolver.blacklistRE = /node_modules[/\\]react[/\\]dist[/\\].*/;
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.server.useGlobalWatchman = true;

// Export the customized config
module.exports = config;
