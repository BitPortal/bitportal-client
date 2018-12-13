import { StyleSheet, Platform } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, FLOATING_CARD_WIDTH, FLOATING_CARD_BORDER_RADIUS } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  headerContainer: {
    width: SCREEN_WIDTH,
    height: NAV_BAR_HEIGHT,
    backgroundColor: Colors.mainThemeColor,
    paddingTop: Platform.OS === 'ios' ? 20 : 0
  },
  navButton: {
    minWidth: 100,
    height: 40,
    paddingTop: 6,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_89_185_226
  },
  text20: {
    fontSize: FontScale(20),
    fontWeight: 'bold',
    color: Colors.textColor_255_255_238
  },
  text24: {
    fontSize: FontScale(24),
    fontWeight: 'bold',
    color: Colors.textColor_255_255_238
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  balanceListContainer: {
    width: FLOATING_CARD_WIDTH,
    backgroundColor: Colors.minorThemeColor,
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomLeftRadius: FLOATING_CARD_BORDER_RADIUS,
    borderBottomRightRadius: FLOATING_CARD_BORDER_RADIUS
  },
  listContainer: {
    width: FLOATING_CARD_WIDTH,
    height: 60,
    marginTop: 1,
    // borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.mainThemeColor
    // borderRadius: FLOATING_CARD_BORDER_RADIUS,
    // marginVertical: 5,
  },
  image: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  }
})

export default styles
