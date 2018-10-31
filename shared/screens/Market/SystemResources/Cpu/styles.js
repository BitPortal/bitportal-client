import { StyleSheet } from 'react-native'
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  FLOATING_CARD_WIDTH,
  FLOATING_CARD_BORDER_RADIUS,
  FLOATING_CARD_MARGIN_BOTTOM
} from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT
    // backgroundColor: 'red'
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
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_89_185_226
  },
  progressContaner: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    width: FLOATING_CARD_WIDTH,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    marginBottom: FLOATING_CARD_MARGIN_BOTTOM,

    minHeight: 80,
    backgroundColor: Colors.minorThemeColor
  },
  totalContainer: {
    marginTop: 20,
    marginBottom: 10
    // width: FLOATING_CARD_WIDTH,
    // borderRadius: FLOATING_CARD_BORDER_RADIUS
  },
  tipsContainer: {
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 32,
    width: FLOATING_CARD_WIDTH,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    backgroundColor: Colors.minorThemeColor
  }
})

export default styles
