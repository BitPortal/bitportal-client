import { StyleSheet } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from 'utils/dimens'
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
  textInputContainer: {
    flexDirection: 'row',
    width: (SCREEN_WIDTH - 60) / 2,
    height: 44,
    borderRadius: 2,
    borderColor: Colors.borderColor_76_76_80,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  textInputStyle: {
    flex: 1,
    textAlign: 'right',
    fontSize: FontScale(15),
    color: Colors.textColor_255_255_238,
    minHeight: 44
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_216_216_216
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_149_149_149
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  },
  btn: {
    marginHorizontal: 15,
    height: 44,
    borderColor: Colors.textColor_93_207_242,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25
  },
  betweenStyle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  listHeader: {
    width: SCREEN_WIDTH - 30,
    height: 40
  },
  listItemContainer: {
    width: SCREEN_WIDTH - 30,
    minHeight: 45,
    borderTopColor: Colors.borderColor_55_55_55,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10
  }
})

export default styles
