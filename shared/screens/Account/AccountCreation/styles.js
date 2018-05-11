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
  tips: {
    width:SCREEN_WIDTH,
    height: 60,
    paddingHorizontal: 32,
    backgroundColor: Colors.textColor_89_185_226
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 10,
    backgroundColor: Colors.bgColor_FFFFFF
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
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT-NAV_BAR_HEIGHT
  },
  content: {
    width: SCREEN_WIDTH,
    minHeight: 300,
    paddingHorizontal: 32,
    paddingVertical: 20,
    alignItems: 'center',
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
  decorator: {
    color: Colors.textColor_89_185_226,
    textDecorationLine: 'underline'
  },
  btn: {
    width: SCREEN_WIDTH-64,
    height: 40,
    borderRadius: 3
  }
})

export default styles
