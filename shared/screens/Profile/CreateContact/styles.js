import { StyleSheet, Platform } from 'react-native'
import Colors from 'resources/colors'
import { 
  FontScale, 
  SCREEN_WIDTH, 
  SCREEN_HEIGHT, 
  NAV_BAR_HEIGHT, 
  TAB_BAR_HEIGHT
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT-NAV_BAR_HEIGHT
  },
  content: {
    width: SCREEN_WIDTH,
    minHeight: 300,
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: Colors.bgColor_48_49_59
  },
  btn: {
    width: SCREEN_WIDTH-64,
    height: 40,
    borderRadius: 3
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  }
})

export default styles
