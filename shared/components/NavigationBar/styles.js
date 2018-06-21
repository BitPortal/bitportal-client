import { StyleSheet, Platform } from 'react-native'
import { SCREEN_WIDTH, FontScale, NAV_BAR_HEIGHT, ifIphoneX } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  containerStyle: {
    width: SCREEN_WIDTH,
    height: NAV_BAR_HEIGHT,
    backgroundColor: Colors.minorThemeColor,
    justifyContent: 'center',
    ...ifIphoneX({
      paddingTop: 24
    }, {
      paddingTop: 0
    })
  },
  textTitle: {
    fontSize: FontScale(20),
    color: Colors.textColor_FFFFEE,
    fontWeight: 'bold'
  },
  navButton: {
    minWidth: 100,
    height: 40,
    paddingTop: Platform.OS === 'ios' ? 6 : 4,
    paddingLeft: 32,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  text20: {
    fontSize: FontScale(20),
    color: Colors.textColor_FFFFEE,
    fontWeight: 'bold'
  },
  text13: {
    fontSize: FontScale(13),
    color: Colors.textColor_FFFFEE
  }
})

export default styles
