import { StyleSheet } from 'react-native'
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
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT - 74
  },
  stakeAmountContainer: {
    width: SCREEN_WIDTH,
    height: 44,
    backgroundColor: Colors.minorThemeColor,
    paddingHorizontal: 32
  },
  titleContainer: {
    width: SCREEN_WIDTH,
    height: 30,
    paddingHorizontal: 32,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.bgColor_000000,
    backgroundColor: Colors.bgColor_30_31_37
  },
  listItem: {
    width: SCREEN_WIDTH,
    height: 70,
    backgroundColor: Colors.bgColor_30_31_37,
    borderBottomColor: Colors.bgColor_000000,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: SCREEN_WIDTH,
    backgroundColor: Colors.bgColor_000000
  },
  rank: {
    minWidth: 24,
    minHeight: 16,
    borderRadius: 4,
    backgroundColor: Colors.textColor_white_2
  },
  location: {
    paddingHorizontal: 8,
    maxWidth: 120,
    height: 20,
    backgroundColor: 'rgba(89,185,226,0.6)',
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderColor_89_185_226
  },
  flag: {
    marginLeft: 10,
    minWidth: 40,
    height: 20,
    borderRadius: 4
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
  radius: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: Colors.bgColor_FFFFFF,
    borderWidth: 1,
    marginRight: 1,
    backgroundColor: Colors.bgColor_30_31_37
  },
  btnContainer: {
    width: SCREEN_WIDTH,
    height: TAB_BAR_HEIGHT,
    backgroundColor: Colors.minorThemeColor,
    paddingHorizontal: 30,
    ...ifIphoneX({
      paddingBottom: 34
    }, {
      paddingBottom: 0
    })
  },
  voteBtn: {
    width: 80,
    height: 30,
    borderRadius: 4,
    backgroundColor: Colors.textColor_89_185_226
  },
  resourcesBtn: {
    width: 100,
    height: 30,
    borderRadius: 2
  }
})

export default styles
