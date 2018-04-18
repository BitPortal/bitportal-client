import { Platform, Dimensions } from 'react-native'

export const SCREEN_WIDTH   = Dimensions.get('window').width
export const SCREEN_HEIGHT  = Platform.OS == 'ios' ? Dimensions.get('window').height : Dimensions.get('window').height - 20
export const NAV_BAR_HEIGHT = Platform.OS == 'ios' ? 64 : 48
export const TAB_BAR_HEIGHT = Platform.OS == 'ios' ? 49 : 56
export const FontScale      = (size: number)    => { return Math.round(size * SCREEN_WIDTH / 375) }
export const WidthPercent   = (percent: number) => { return SCREEN_WIDTH * percent / 100 }
export const HeightPercent  = (percent: number) => { return SCREEN_HEIGHT * percent / 100 }

