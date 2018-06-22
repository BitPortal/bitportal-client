import { StyleSheet, Platform } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.minorThemeColor
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
  addAssetsContainer: {
    width: SCREEN_WIDTH,
    height: 50
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  listContainer: {
    width: SCREEN_WIDTH,
    height: 70,
    marginTop: 1
  },
  createAccountContainer: {
    width: SCREEN_WIDTH - 64,
    height: (SCREEN_WIDTH / 2) - 32,
    borderRadius: 12,
    marginHorizontal: 32,
    marginVertical: 20,
    backgroundColor: Colors.mainThemeColor
  }
})

export default styles
