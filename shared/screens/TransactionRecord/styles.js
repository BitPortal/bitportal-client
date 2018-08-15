import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import {
  FontScale,
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
  },
  content: {
    padding: 32,
    width: SCREEN_WIDTH
  },
  header: {
    width: SCREEN_WIDTH - 64,
    height: 30,
    paddingHorizontal: 32,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  },
  header2: {
    width: SCREEN_WIDTH - 64,
    height: 60,
    backgroundColor: Colors.bgColor_30_31_37
  },
  amountContent: {
    padding: 20,
    width: SCREEN_WIDTH - 64,
    minHeight: 100,
    backgroundColor: Colors.minorThemeColor
  },
  separator: {
    width: SCREEN_WIDTH - 64,
    height: 10
  },
  seperator2: {
    width: SCREEN_WIDTH - 84,
    height: 2
  },
  semicircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: -8,
    backgroundColor: Colors.mainThemeColor
  },
  card: {
    width: SCREEN_WIDTH - 64,
    height: 180,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: Colors.bgColor_30_31_37
  },
  btn: {
    width: 90,
    marginTop: 10,
    height: 30,
    borderRadius: 3,
    backgroundColor: Colors.textColor_216_216_216
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  text10: {
    fontSize: FontScale(10),
    color: Colors.textColor_181_181_181
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  },
  text24: {
    fontSize: FontScale(24),
    color: Colors.textColor_89_185_226
  }
})

export default styles
