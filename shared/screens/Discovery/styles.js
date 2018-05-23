import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  TAB_BAR_HEIGHT,
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor,
    paddingBottom: TAB_BAR_HEIGHT,
  },
  navButton: {
    minWidth: 100,
    height: 40,
    paddingTop: 6,
    marginLeft: 10
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text24: {
    fontSize: FontScale(24),
    color: Colors.textColor_255_255_238,
    fontWeight: 'bold'
  },
  markdownContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    paddingBottom: TAB_BAR_HEIGHT,
  },
})

export default styles
