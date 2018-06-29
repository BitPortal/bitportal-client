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
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT
  },
  itemContainer: {
    width: SCREEN_WIDTH,
    height: 50,
    paddingHorizontal: 32,
    backgroundColor: Colors.bgColor_48_49_59
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_181_181_181
  },
  headTitle: {
    width: SCREEN_WIDTH,
    height: 32,
    paddingHorizontal: 32,
    backgroundColor: Colors.mainThemeColor,
    justifyContent: 'center'
  }
})

export default styles
