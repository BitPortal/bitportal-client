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
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT
  },
  header: {
    width: SCREEN_WIDTH,
    height: 90,
    paddingHorizontal: 32,
    backgroundColor: Colors.minorThemeColor,
  },
  info: {
    width: SCREEN_WIDTH,
    minHeight: 80,
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: Colors.minorThemeColor,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22
  },
  flag: {
    width: 40,
    height: 20,
    borderRadius: 4
  },
  line: {
    width: 2,
    height: 14,
    backgroundColor: Colors.mainThemeColor
  },
  intro: {
    width: SCREEN_WIDTH,
    minHeight: 50,
    backgroundColor: Colors.minorThemeColor
  },
  introTitle: {
    width: SCREEN_WIDTH,
    height: 50
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
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  }
})

export default styles
