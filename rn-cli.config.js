const nodeLibs = require('node-libs-react-native')
const path = require('path')

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
  //   babelTransformerPath: require.resolve('react-native-typescript-transformer')
  }
}
