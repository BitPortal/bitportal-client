const blacklist = require('metro/src/blacklist')
const nodeLibs = require('node-libs-react-native')

module.exports = {
  extraNodeModules: {
    ...nodeLibs,
    vm: require.resolve('vm-browserify')
  },
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer')
  },
  getSourceExts() {
    return ['js', 'mobile.js', 'jsx', 'mobile.jsx', 'ts', 'mobile.ts', 'tsx', 'mobile.tsx']
  },
  getBlacklistRE () {
    return blacklist([/react-native\/local-cli\/core\/__fixtures__.*/])
  }
}
