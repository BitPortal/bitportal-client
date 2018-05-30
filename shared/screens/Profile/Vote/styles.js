import { StyleSheet, Platform } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, ifIphoneX } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT-NAV_BAR_HEIGHT-74
  },
  stakeAmountContainer:{
    width: SCREEN_WIDTH,
    height: 44,
    backgroundColor: Colors.minorThemeColor
  },
  titleContainer: {
    width: SCREEN_WIDTH,
    height: 30,
    paddingHorizontal: 32,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.bgColor_000000,
    backgroundColor: Colors.bgColor_48_49_59
  },
  listItem: {
    width: SCREEN_WIDTH,
    height: 70,
    backgroundColor: Colors.bgColor_48_49_59
  },
  separator: {
    height: StyleSheet.hairlineWidth, 
    width: SCREEN_WIDTH, 
    backgroundColor: Colors.bgColor_000000 
  },
  location: {
    paddingHorizontal: 3,
    paddingHorizontal: 8,
    minWidth: 44,
    height: 20,
    backgroundColor: 'rgba(89,185,226,0.6)',
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderColor_89_185_226
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
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_181_181_181
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238,
    fontWeight: 'bold'
  },
})

export default styles
