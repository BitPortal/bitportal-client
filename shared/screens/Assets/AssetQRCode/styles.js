import { StyleSheet, Platform } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, isIphoneX, ifIphoneX } from 'utils/dimens'
import Colors from 'resources/colors'

const screen_width = isIphoneX ? SCREEN_WIDTH - 40 : SCREEN_WIDTH

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  close: {
    ...ifIphoneX({
      marginTop: NAV_BAR_HEIGHT / 4
    }, {
      marginTop: 0
    }),
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  qrCodeContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    width: screen_width - 40,
    minHeight: 100,
    borderRadius: 2,
    backgroundColor: Colors.bgColor_FFFFFF
  },
  head: {
    width: screen_width - 40,
    height: 60,
    backgroundColor: Colors.textColor_89_185_226
  },
  inputContainer: {
    width: screen_width - 40 - 30,
    height: 40,
    marginHorizontal: 15,
    marginVertical: 20,
    borderBottomColor: Colors.textColor_181_181_181,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  input: {
    width: screen_width - 40 - 30,
    height: 42,
    fontSize: FontScale(20),
    color: Colors.minorThemeColor,
  },
  separator: {
    width: screen_width - 40,
    height: 10
  },
  seperator2: {
    width: screen_width - 80,
    height: 2
  },
  semicircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.bgColor_000000
  },
  qrCode: {
    width: screen_width - 40,
    minHeight: 100,
    paddingVertical: 20
  },
  btnContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    width: screen_width - 40,
    height: 40
  },
  btn: {
    width: (screen_width - 60) / 2,
    height: 40,
    borderRadius: 3,
    backgroundColor: Colors.textColor_89_185_226
  },
  text24: {
    fontSize: FontScale(24),
    color: Colors.textColor_255_255_238,
    fontWeight: 'bold'
  },
  text10: {
    width: screen_width - 40 - 30,
    fontSize: FontScale(8),
    color: Colors.textColor_216_216_216
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238,
  }
})

export default styles
