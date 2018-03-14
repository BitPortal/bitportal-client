module.exports = {
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer')
  },
  getSourceExts() {
    return ['js', 'mobile.js', 'ts', 'mobile.ts', 'tsx', 'mobile.tsx']
  }
}
