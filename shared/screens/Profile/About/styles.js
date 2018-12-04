import { StyleSheet } from 'react-native'
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  TAB_BAR_HEIGHT,
  FLOATING_CARD_WIDTH,
  FLOATING_CARD_BORDER_RADIUS
} from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor,
    alignItems: 'center'
  },
  scrollContainer: {
    width: FLOATING_CARD_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT
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
  content: {
    // width: SCREEN_WIDTH,
    minHeight: 100,
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: Colors.minorThemeColor,
    alignItems: 'center',
    borderRadius: FLOATING_CARD_BORDER_RADIUS
  },
  image: {
    width: 75,
    height: 116
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  }
})

export default styles
