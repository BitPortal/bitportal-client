module.exports = {
  extraNodeModules: {
    ...require('node-libs-react-native'),
    vm: require.resolve('vm-browserify')
  },
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer')
  },
  getSourceExts() {
    return ['js', 'mobile.js', 'ts', 'mobile.ts', 'tsx', 'mobile.tsx']
  }
}
