import { Platform, Dimensions, StatusBar } from 'react-native'

export const SCREEN_WIDTH   = Dimensions.get('window').width
export const SCREEN_HEIGHT  = Platform.OS == 'ios' ? Dimensions.get('window').height : Dimensions.get('window').height - StatusBar.currentHeight
export const NAV_BAR_HEIGHT = Platform.OS == 'ios' ? 64 : 48
export const TAB_BAR_HEIGHT = Platform.OS == 'ios' ? 49 : 56
export const FontScale      = (size)    => { return Math.round(size * SCREEN_WIDTH / 375) }
export const WidthPercent   = (percent) => { return SCREEN_WIDTH * percent / 100 }
export const HeightPercent  = (percent) => { return SCREEN_HEIGHT * percent / 100 }

