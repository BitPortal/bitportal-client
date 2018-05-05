import { StyleSheet, Platform } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, WidthPercent } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  exchangeListContainer: {
    width: 100,
    minHeight: 150,
    backgroundColor: Colors.bgColor_59_59_59,
    marginLeft: -4,
    borderRadius: 4,
  },
  btn: {
    width: 100,
    height: 30,
    borderBottomColor: Colors.textColor_216_216_216,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 10,
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  }
})

export default styles
