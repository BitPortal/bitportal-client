import { StyleSheet, Platform } from 'react-native'
import Colors from 'resources/colors'
import { 
  FontScale, 
  SCREEN_WIDTH, 
  SCREEN_HEIGHT, 
  NAV_BAR_HEIGHT, 
  TAB_BAR_HEIGHT,
  KEYBOARD_HEIGHT
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT-NAV_BAR_HEIGHT
  },
  keyboard: {
    width: SCREEN_WIDTH,
    height: KEYBOARD_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  }
})

export default styles
