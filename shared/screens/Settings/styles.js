import { StyleSheet, Platform } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, WidthPercent } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.bgColor_27_27_26
  },
  headContaner: {
    width: SCREEN_WIDTH,
    height: 102 + NAV_BAR_HEIGHT,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS == 'ios' ? 20 : 0
  },
  accountContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  accountInfo: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'space-between'
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 102 - NAV_BAR_HEIGHT
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_149_149_149
  },
  text20: {
    fontSize: FontScale(20),
    color: Colors.textColor_216_216_216
  }
})

export default styles
