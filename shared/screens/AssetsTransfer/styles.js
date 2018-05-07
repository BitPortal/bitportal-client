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
    backgroundColor: Colors.minorThemeColor
  },
  navButton: {
    minWidth: 100, 
    height: 40, 
    paddingTop: 6, 
    marginLeft: 10, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  content: {
    width: SCREEN_WIDTH,
    minHeight: 300,
    paddingHorizontal: 32,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: Colors.bgColor_48_49_59
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT-NAV_BAR_HEIGHT
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
  },
  inputContainer: {
    width: SCREEN_WIDTH-64,
    height: SCREEN_WIDTH/4-16,
    flexDirection: 'row',
    marginTop: 20,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.textColor_181_181_181
  },
  input: {
    width: SCREEN_WIDTH-64,
    height: SCREEN_WIDTH/4-16,
    padding: 10,
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14)
  },
})

export default styles
