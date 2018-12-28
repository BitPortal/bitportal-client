import Colors from 'resources/colors'
import {
  SCREEN_WIDTH,
  FLOATING_CARD_WIDTH,
  FLOATING_CARD_BORDER_RADIUS,
  FLOATING_CARD_MARGIN_BOTTOM
} from 'utils/dimens'

const styles = {
  container: {
    width: SCREEN_WIDTH,
    alignItems: 'center'
  },
  tabBar: {
    width: FLOATING_CARD_WIDTH,
    backgroundColor: Colors.minorThemeColor,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    height: 30,
    marginBottom: FLOATING_CARD_MARGIN_BOTTOM
  },
  singleTab: {
    height: 30,
    width: FLOATING_CARD_WIDTH / 2,
    margin: 0,
    borderRadius: FLOATING_CARD_BORDER_RADIUS
  },
  selectedTab: {
    height: 30,
    width: FLOATING_CARD_WIDTH / 2,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    backgroundColor: 'blue'
  }
}

export default styles
