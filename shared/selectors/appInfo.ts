// import { createSelector } from 'reselect'
import Immutable from 'immutable'

export const getInitialAppInfo = (presetPlatform?: any, presetVersion?: any) => Immutable.fromJS({
  name: 'bitportal',
  platform: presetPlatform || '',
  version: presetVersion || ''
})
