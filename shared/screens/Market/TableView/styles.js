import { StyleSheet, Platform } from 'react-native'
import Colors from 'resources/colors'
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  TAB_BAR_HEIGHT,
  WidthPercent
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  headerContainer: {
    width: SCREEN_WIDTH,
    height: NAV_BAR_HEIGHT,
    backgroundColor: Colors.minorThemeColor,
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
    borderBottomColor: Colors.mainThemeColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    height: 70,
    backgroundColor: Colors.minorThemeColor
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
  headerTitle: {
    width: SCREEN_WIDTH,
    height: 30,
    backgroundColor: Colors.minorThemeColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.mainThemeColor
  },
  quoteContainer: {
    width: SCREEN_WIDTH,
    height: 40,
    flexDirection: 'row',
    backgroundColor: Colors.minorThemeColor
  }
})

export default styles
