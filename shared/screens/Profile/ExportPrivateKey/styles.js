import { StyleSheet } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT
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
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.borderColor_89_185_226
  },
  content: {
    width: SCREEN_WIDTH,
    minHeight: 300,
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: Colors.bgColor_48_49_59
  },
  btn: {
    width: SCREEN_WIDTH - 64,
    height: 40,
    borderRadius: 3
  },
  inputContainer: {
    width: SCREEN_WIDTH - 64,
    height: 60,
    flexDirection: 'row',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.minorThemeColor,
    backgroundColor: Colors.minorThemeColor
  },
  input: {
    width: SCREEN_WIDTH - 64,
    height: 60,
    padding: 10,
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14)
  }
})

export default styles
