import { StyleSheet } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, ifIphoneX } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.minorThemeColor
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT
  },
  itemContainer: {
    width: SCREEN_WIDTH,
    height: 50,
    paddingHorizontal: 32,
    backgroundColor: Colors.bgColor_48_49_59
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
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_181_181_181
  },
  headTitle: {
    width: SCREEN_WIDTH,
    height: 32,
    paddingHorizontal: 32,
    backgroundColor: Colors.mainThemeColor,
    justifyContent: 'center'
  },
  btnContainer: {
    width: SCREEN_WIDTH,
    height: TAB_BAR_HEIGHT,
    paddingHorizontal: 32,
    backgroundColor: Colors.mainThemeColor,
    ...ifIphoneX({
      paddingBottom: 34
    }, {
      paddingBottom: 0
    })
  },
  btn: {
    width: SCREEN_WIDTH-64,
    height: 30,
    borderRadius: 2
  }
})

export default styles
