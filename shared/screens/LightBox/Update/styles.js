import { StyleSheet, Platform } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, WidthPercent } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Platform.OS == 'ios' ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.7)"
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  content: {
    width: WidthPercent(80),
    minHeight: 200,
    borderRadius: 5,
    backgroundColor: Colors.minorThemeColor
  },
  titleContainer: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: WidthPercent(80),
    height: 44,
    borderBottomColor: Colors.borderColor_55_55_55,
    borderBottomWidth: StyleSheet.hairlineWidth,  
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238,
    fontWeight: 'bold'
  },
  description: {
    width: WidthPercent(80),
    minHeight: 60,
    padding: 15
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_181_181_181
  },
  btnContainer: {
    width: WidthPercent(80),
    height: 44,
    borderTopColor: Colors.borderColor_55_55_55,
    borderTopWidth: StyleSheet.hairlineWidth,  
    flexDirection: 'row'
  },
  line: {
    width: 1,
    height: 44,
    backgroundColor: Colors.borderColor_55_55_55
  },
  btn: {
    flex: 1
  },
  negativeText: {
    color: Colors.textColor_255_255_238
  },
  positiveText: {
    color: Colors.textColor_89_185_226
  }
})

export default styles
