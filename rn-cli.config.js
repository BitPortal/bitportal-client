module.exports = {
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer')
  },
  getSourceExts() {
    return ['ts', 'mobile.ts', 'tsx', 'mobile.tsx']
  }
}
