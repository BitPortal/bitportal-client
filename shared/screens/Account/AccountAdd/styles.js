import { StyleSheet } from 'react-native'
import { SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor,
    alignItems: 'center'
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  }
})

export default styles
