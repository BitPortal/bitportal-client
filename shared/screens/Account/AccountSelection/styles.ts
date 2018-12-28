import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, ifIphoneX, FontScale } from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT,
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
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  paddingStyle: {
    paddingHorizontal: 20
  },
  textRadius: {
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.bgColor_FFFFFF
  },
  btnContainer: {
    width: SCREEN_WIDTH,
    height: TAB_BAR_HEIGHT,
    backgroundColor: Colors.minorThemeColor,
    paddingHorizontal: 20,
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
  selectAllBtn: {
    padding: 10
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
