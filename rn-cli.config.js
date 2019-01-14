const nodeLibs = require('node-libs-react-native')

module.exports = {
  resolver: {
    extraNodeModules: {
      ...nodeLibs,
      vm: require.resolve('vm-browserify')
    },
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json']
  },
  transformer: {
    enableBabelRCLookup: true,
    enableBabelRuntime: true
  }
}
