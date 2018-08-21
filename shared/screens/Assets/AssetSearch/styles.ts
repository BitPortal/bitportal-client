import { StyleSheet } from 'react-native'
import { SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, FontScale, ifIphoneX } from 'utils/dimens'
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
  navContainer: {
    width: SCREEN_WIDTH,
    height: NAV_BAR_HEIGHT,
    backgroundColor: Colors.minorThemeColor,
    ...ifIphoneX({
      paddingTop: 24
    }, {
      paddingTop: 0
    })
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  text20: {
    fontSize: FontScale(20),
    color: Colors.textColor_255_255_238
  },
  listContainer: {
    width: SCREEN_WIDTH,
    height: 70,
    marginTop: 1
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  }
})

export default styles
