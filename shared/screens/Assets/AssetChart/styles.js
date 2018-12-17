import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, ifIphoneX, TAB_BAR_HEIGHT } from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
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
  scrollContainer: {
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT,
    flexDirection: 'column'
  },
  content: {
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  topContent: {
    alignItems: 'center',
    width: SCREEN_WIDTH
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_181_181_181
  },
  text24: {
    fontSize: FontScale(24),
    color: Colors.textColor_255_255_238,
    fontWeight: 'bold'
  },
  chartContainer: {
    width: SCREEN_WIDTH - 40,
    height: 160
  },
  btnContainer: {
    width: SCREEN_WIDTH,
    height: TAB_BAR_HEIGHT,
    backgroundColor: Colors.mainThemeColor,
    ...ifIphoneX({
      paddingBottom: 34
    }, {
      paddingBottom: 0
    })
  },
  line: {
    height: 10,
    width: 1,
    backgroundColor: Colors.bgColor_FFFFFF
  },
  image: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  btn: {
    width: (SCREEN_WIDTH - 1) / 2,
    ...ifIphoneX({
      height: TAB_BAR_HEIGHT - 34
    }, {
      height: TAB_BAR_HEIGHT
    })
  }
})

export default styles
