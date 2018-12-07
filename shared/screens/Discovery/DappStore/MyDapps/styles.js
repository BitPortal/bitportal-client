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
    alignItems: 'center',
    height: 125,
    marginBottom: 0
  },
  wrapper: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    height: 110
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
    width: FLOATING_CARD_WIDTH / 3,
    margin: 0,
    borderRadius: FLOATING_CARD_BORDER_RADIUS
  },
  selectedTab: {
    height: 30,
    width: FLOATING_CARD_WIDTH / 3,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    backgroundColor: 'blue'
  },
  dAppScrollViewContainer: {
    width: FLOATING_CARD_WIDTH,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    // paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: Colors.minorThemeColor
    // flex: 1
  },
  tabbar: {
    height: 10,
    backgroundColor: Colors.mainThemeColor,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingTop: 0
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'white'
  },
  container: {
    // flex: 1,
    width: FLOATING_CARD_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    flexDirection: 'row'
  },
  indicator: {
    width: 3,
    height: 3,
    borderRadius: 24,
    backgroundColor: 'grey',
    margin: 6
  },
  activeIndicator: {
    width: 3,
    height: 3,
    borderRadius: 24,
    backgroundColor: 'white',
    margin: 6
  },
  badge: {
    marginTop: 4,
    marginRight: 32,
    backgroundColor: '#f44336',
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -2
  }
}

export default styles
