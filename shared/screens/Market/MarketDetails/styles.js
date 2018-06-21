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
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  spaceAround: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  spaceBetween: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  btnContainer: {
    width: SCREEN_WIDTH,
    height: 70,
    borderTopColor: Colors.borderColor_48_48_46,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  btn: {
    width: 110,
    height: 40,
    borderColor: Colors.borderColor_36_68_78,
    borderWidth: StyleSheet.hairlineWidth,
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
    backgroundColor: Colors.minorThemeColor
  },
  chart: {
    width: SCREEN_WIDTH,
    height: 230
  },
  marketElementContainer: {
    width: SCREEN_WIDTH,
    minHeight: 55,
    borderTopColor: Colors.borderColor_48_48_46,
    borderTopWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 15
  }
})

export default styles
