import Colors from 'resources/colors'
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT
} from 'utils/dimens'

const styles = {
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  scrollContainer: {
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT,
    flexDirection: 'column'
  }
}

export default styles
