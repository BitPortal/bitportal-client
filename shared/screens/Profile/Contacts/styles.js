import { StyleSheet, Platform } from 'react-native'
import Colors from 'resources/colors'
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  TAB_BAR_HEIGHT
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT
  },
  listItem: {
    width: SCREEN_WIDTH,
    height: 50,
    justifyContent: 'center',
    paddingLeft: 32,
    borderBottomColor: Colors.minorThemeColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: Colors.bgColor_48_49_59
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_181_181_181
  }
})

export default styles
