import { StyleSheet } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - 70
  },
  cardContainer: {
    width: SCREEN_WIDTH,
    minHeight: 100,
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: Colors.minorThemeColor,
    marginBottom: 13
  },
  spaceAround: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  spaceBetween: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  btnContainer: {
    width: SCREEN_WIDTH,
    height: 70,
    borderTopColor: Colors.borderColor_48_48_46
    // borderTopWidth: StyleSheet.hairlineWidth
  },
  btn: {
    width: 110,
    height: 40,
    borderColor: Colors.borderColor_36_68_78,
    // borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_93_207_242
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  },
  chartContainer: {
    width: SCREEN_WIDTH,
    height: 350,
    paddingVertical: 20,
    marginVertical: 20,
    backgroundColor: Colors.bgColor_30_31_37
  },
  chart: {
    width: SCREEN_WIDTH,
    height: 230
  },
  marketElementContainer: {
    width: SCREEN_WIDTH,
    minHeight: 55,
    // borderTopColor: Colors.borderColor_48_48_46,
    borderBottomColor: Colors.minorThemeColor,
    // borderTopWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: Colors.bgColor_30_31_37,
    borderBottomWidth: 1
    // justifyContent: 'center'
  },
  headerText: {
    fontSize: FontScale(16),
    color: Colors.textColor_89_185_226
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  loadingSymbol: {
    width: SCREEN_WIDTH,
    height: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default styles
