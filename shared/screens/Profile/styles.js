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
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT
  },
  scrollViewStyle: {
    paddingBottom: 0,
    alignItems: 'center'
  },

  navButton: {
    minWidth: 100,
    height: 40,
    paddingTop: 6,
    marginLeft: 10
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.white
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.white
  },
  text24: {
    fontSize: FontScale(24),
    color: Colors.white,
    fontWeight: 'bold'
  }
})

export default styles
