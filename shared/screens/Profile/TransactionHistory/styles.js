import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT,
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_181_181_181
  },
  sectionHeader: {
    width: SCREEN_WIDTH,
    height: 32,
    backgroundColor: Colors.mainThemeColor,
    justifyContent: 'center'
  }
})

export default styles
