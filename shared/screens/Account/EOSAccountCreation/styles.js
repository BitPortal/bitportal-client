import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT
  }
})

export default styles
