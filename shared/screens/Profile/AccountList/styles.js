import { StyleSheet, Platform } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, ifIphoneX } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT
  },
  btnContainer: {
    width: SCREEN_WIDTH,
    height: TAB_BAR_HEIGHT,
    backgroundColor: Colors.minorThemeColor,
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
  btn: {
    width: (SCREEN_WIDTH - 1) / 2,
    ...ifIphoneX({
      height: TAB_BAR_HEIGHT - 34
    }, {
      height: TAB_BAR_HEIGHT
    })
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
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  }
})

export default styles
