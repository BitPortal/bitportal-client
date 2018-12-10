import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, FontScale } from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT,
    alignItems: 'center'
  },
  cardContainer: {
    width: SCREEN_WIDTH - 64,
    height: 128,
    marginTop: 20
  },
  contentContainer: {
    width: SCREEN_WIDTH - 64,
    height: 64
  },
  topRadius: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  bottomRadius: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  paddingStyle: {
    paddingHorizontal: 20
  },
  textRadius: {
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.bgColor_FFFFFF
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  }
})

export default styles