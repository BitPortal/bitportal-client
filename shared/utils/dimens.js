import { Platform, Dimensions, StatusBar } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import _ from 'lodash'
const androidX = ['MI 8 SE']

export const isIphoneX = () => {
  const dimen = Dimensions.get('window')

  if (Platform.OS === 'ios') {
    return !Platform.isPad && !Platform.isTVOS && (dimen.height === 812 || dimen.width === 812)
  } else {
    return _.findIndex(androidX, o => (DeviceInfo.getUserAgent().indexOf(o) !== -1)) !== -1
  }
}

export const ifIphoneX = (iphoneXStyle, regularStyle) => {
  if (isIphoneX()) { return iphoneXStyle }
  return regularStyle
}

const getScreenHeight = () => {
  const tempHeight = Dimensions.get('window').height
  return Platform.OS === 'ios' ? tempHeight : tempHeight - StatusBar.currentHeight
}

const getNavBarHeigt = () => {
  let tempHeight = Platform.OS === 'ios' ? 64 : 48
  tempHeight = isIphoneX() ? 88 : tempHeight
  return tempHeight
}

const getTabBarHeight = () => {
  let tempHeight = Platform.OS === 'ios' ? 49 : 56
  tempHeight = isIphoneX() ? 83 : tempHeight
  return tempHeight
}

export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = getScreenHeight()
export const NAV_BAR_HEIGHT = getNavBarHeigt()
export const TAB_BAR_HEIGHT = getTabBarHeight()
export const KEYBOARD_HEIGHT = Platform.OS === 'ios' ? 240 : 300
export const FontScale = size => Math.round((size * SCREEN_WIDTH) / 375)
export const WidthPercent = percent => (SCREEN_WIDTH * percent) / 100
export const HeightPercent = percent => (SCREEN_HEIGHT * percent) / 100
