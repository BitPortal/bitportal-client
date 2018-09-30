// import { createSelector } from 'reselect'
import Immutable from 'immutable'

export const getInitialAppInfo = (presetPlatform?: any, presetVersion?: any) => Immutable.fromJS({
  name: 'BitPortal',
  platform: presetPlatform || '',
  version: presetVersion || ''
})
