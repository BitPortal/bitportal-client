import { StyleSheet, Platform } from 'react-native'
import Colors from 'resources/colors'
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  TAB_BAR_HEIGHT,
  FLOATING_CARD_WIDTH,
  FLOATING_CARD_BORDER_RADIUS,
  WidthPercent,
  MARKET_BAR_HEIGHT
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    // height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor,
    alignItems: 'center'
  },
  headerTitle: {
    width: FLOATING_CARD_WIDTH,
    height: MARKET_BAR_HEIGHT,
    backgroundColor: Colors.bgColor_30_31_37,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.minorThemeColor,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    marginBottom: 10
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text20: {
    fontSize: FontScale(20),
    fontWeight: 'bold',
    color: Colors.textColor_FFFFEE
  },
  text13: {
    fontSize: FontScale(13),
    color: Colors.textColor_FFFFEE
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_181_181_181
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  },
  text17: {
    fontSize: FontScale(17),
    color: Colors.textColor_142_142_147
  },
  searchContainer: {
    width: ((SCREEN_WIDTH - 30) * 2) / 3,
    height: 40,
    marginVertical: 10,
    marginLeft: 15,
    paddingLeft: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.borderColor_41_41_38,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInputStyle: {
    width: ((SCREEN_WIDTH - 30) * 2) / 3 - 40,
    height: 40,
    marginLeft: Platform.OS === 'ios' ? 11 : 7,
    color: Colors.textColor_FFFFEE,
    fontSize: FontScale(17)
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT - 70,
    backgroundColor: Colors.mainThemeColor
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.minorThemeColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    height: 70,
    backgroundColor: Colors.bgColor_30_31_37
  },
  coin: {
    width: WidthPercent(30),
    height: 42,
    alignItems: 'center',
    flexDirection: 'row'
  },
  price: {
    width: WidthPercent(40)
  },
  change: {
    maxWidth: WidthPercent(30)
  },

  quoteContainer: {
    width: SCREEN_WIDTH,
    height: 40,
    flexDirection: 'row',
    backgroundColor: Colors.minorThemeColor
  }
})

export default styles
