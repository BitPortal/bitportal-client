import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, FontScale, KEYBOARD_HEIGHT, FLOATING_CARD_WIDTH, FLOATING_CARD_BORDER_RADIUS } from 'utils/dimens'

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
  content: {
    width: SCREEN_WIDTH,
    minHeight: 100,
    paddingVertical: 20,
    backgroundColor: Colors.mainThemeColor
  },
  qrContainer: {
    padding: 15,
    backgroundColor: Colors.bgColor_FFFFFF,
    borderRadius: 8
  },
  inputContainer: {
    width: FLOATING_CARD_WIDTH,
    paddingHorizontal: 20,
    height: 60,
    marginVertical: 10,
    backgroundColor: Colors.bgColor_30_31_37,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
  },
  input: {
    minWidth: 140,
    height: 42,
    fontSize: FontScale(14),
    color: Colors.textColor_149_149_149,
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.bgColor_FFFFFF,
  },
  keyboard: {
    width: SCREEN_WIDTH,
    height: KEYBOARD_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  }
})

export default styles
