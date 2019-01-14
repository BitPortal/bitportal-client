export const getInitialAppInfo = (presetPlatform?: any, presetVersion?: any) => ({
  name: 'BitPortal',
  platform: presetPlatform || '',
  version: presetVersion || ''
})
