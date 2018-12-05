import Colors from 'resources/colors'
import {
  SCREEN_WIDTH,
  FLOATING_CARD_WIDTH,
  FLOATING_CARD_BORDER_RADIUS,
  FLOATING_CARD_MARGIN_BOTTOM
} from 'utils/dimens'

const styles = {
  sceneContainer: {
    width: SCREEN_WIDTH,
    height: 250
  },
  wrapper: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    height: 250
  },
  tabBar: {
    width: FLOATING_CARD_WIDTH,
    backgroundColor: Colors.minorThemeColor,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    height: 30,
    marginBottom: FLOATING_CARD_MARGIN_BOTTOM
  },
  dAppScrollViewContainer: {
    width: FLOATING_CARD_WIDTH,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    // paddingVertical: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: Colors.minorThemeColor
    // flex: 1
  }
}

export default styles
