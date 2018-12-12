import { StyleSheet, Platform } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, FLOATING_CARD_WIDTH, FLOATING_CARD_BORDER_RADIUS } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
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
    color: Colors.white
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
  addAssetsContainer: {
    width: FLOATING_CARD_WIDTH,
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: Colors.minorThemeColor,
    borderTopLeftRadius: FLOATING_CARD_BORDER_RADIUS,
    borderTopRightRadius: FLOATING_CARD_BORDER_RADIUS,
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  listContainer: {
    width: FLOATING_CARD_WIDTH,
    height: 60,
    marginTop: 1,
    borderBottomColor: Colors.minorThemeColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.bgColor_30_31_37,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    marginVertical: 5,
    marginLeft: 10
  },
  createAccountContainer: {
    width: SCREEN_WIDTH - 64,
    height: (SCREEN_WIDTH / 2) - 32,
    borderRadius: 12,
    marginHorizontal: 32,
    marginVertical: 20,
    backgroundColor: Colors.mainThemeColor
  },
  image: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  }
})

export default styles
