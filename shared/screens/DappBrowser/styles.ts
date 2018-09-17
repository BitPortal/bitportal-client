import { StyleSheet } from 'react-native'
import { SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, FontScale } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  content: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT,
    backgroundColor: Colors.minorThemeColor
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn: {
    width: 100,
    height: 30,
    borderRadius: 3,
    marginTop: 30,
    backgroundColor: Colors.textColor_89_185_226
  },
  loadContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT,
    marginTop: NAV_BAR_HEIGHT
  },
  borderStyle: {
    width: 100,
    height: 100,
    marginTop: -NAV_BAR_HEIGHT*2,
    borderRadius: 4,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
})

export default styles
