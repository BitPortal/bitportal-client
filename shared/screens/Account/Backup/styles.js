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
  center: {
    alignItems: 'center',
    justifyContent: 'center'
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
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  btn: {
    width: SCREEN_WIDTH-64,
    height: 40,
    borderRadius: 3
  },
  inputContainer: {
    width: SCREEN_WIDTH-64,
    height: SCREEN_WIDTH/2-32,
    flexDirection: 'row',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.textColor_181_181_181
  },
  input: {
    width: SCREEN_WIDTH-64,
    height: SCREEN_WIDTH/2-32,
    padding: 10,
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14)
  }
})

export default styles
