import { StyleSheet } from 'react-native'
import { SCREEN_HEIGHT, SCREEN_WIDTH, FontScale, NAV_BAR_HEIGHT } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  containerStyle: {
    width: SCREEN_WIDTH,
    height: NAV_BAR_HEIGHT,
    backgroundColor: Colors.bgColor_27_27_26
  },
  textTitle: {
    fontSize: FontScale(18),
    color: Colors.textColor_FFFFEE
  },
  navButton: {
    minWidth: 80, 
    height: 40, 
    paddingTop: 6, 
    marginLeft: 10, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  text20: {
    fontSize: FontScale(20),
    color: Colors.textColor_FFFFEE
  },
  text13: {
    fontSize: FontScale(13),
    color: Colors.textColor_FFFFEE
  }
})

export default styles;