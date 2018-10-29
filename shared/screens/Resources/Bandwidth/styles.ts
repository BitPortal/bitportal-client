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
    height: SCREEN_HEIGHT-NAV_BAR_HEIGHT
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
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_89_185_226
  },
  progressContaner: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: SCREEN_WIDTH,
    minHeight: 80,
    backgroundColor: Colors.minorThemeColor
  },
  totalContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  tipsContainer: {
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 32,
    width: SCREEN_WIDTH,
    backgroundColor: Colors.minorThemeColor
  }
})

export default styles
