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
  cardContainer: {
    width: SCREEN_WIDTH,
    minHeight: 100,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: Colors.minorThemeColor
  },
  spaceBetween: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_149_149_149
  },
  headerText: {
    fontSize: FontScale(16),
    color: Colors.textColor_89_185_226
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
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row'
    // alignItems: 'center'
    // justifyContent: 'center'
  },
  tag: {
    borderRadius: 4,
    padding: 2,
    borderColor: Colors.textColor_89_185_226,
    borderWidth: 1,
    marginRight: 10
  }
})

export default styles
