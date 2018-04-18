import { StyleSheet, Platform } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, WidthPercent } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.bgColor_27_27_26
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT
  },
  cardContainer: {
    width: SCREEN_WIDTH,
    minHeight: 100,
    paddingVertical: 10,
    paddingHorizontal: 15,
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
  }
})

export default styles
