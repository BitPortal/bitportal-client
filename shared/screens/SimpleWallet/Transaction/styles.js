import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  FontScale,
  FLOATING_CARD_WIDTH,
  FLOATING_CARD_BORDER_RADIUS,
  FLOATING_CARD_MARGIN_BOTTOM
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor,
    alignItems: 'center'
  },
  scrollContainer: {
    width: FLOATING_CARD_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT,
    // backgroundColor: Colors.mainThemeColor,
    // backgroundColor: 'red',
    borderRadius: FLOATING_CARD_BORDER_RADIUS
  },
  contentContainer: {
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    backgroundColor: Colors.minorThemeColor,
    // backgroundColor: 'red',
    // alignItems: 'center',
    width: FLOATING_CARD_WIDTH,
    marginBottom: 15
    // minHeight: 200
    // margin: 15
    // padding: 20,
    // flex: 1
  },
  dappWrapper: {
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.minorThemeColor
    // flex: 1,
    // minHeight: 200
  },
  gradient: {
    borderRadius: 5,
    width: '100%',
    minHeight: 30,
    padding: 10,
    marginTop: 10,
    marginBottom: 20
  },
  qrCodeContainer: {
    borderRadius: 12,
    backgroundColor: Colors.bgColor_FFFFFF,
    marginBottom: 20,
    padding: 10,
    width: 120,
    height: 120
  },
  inputContainer: {
    width: '100%',
    minHeight: 30,
    marginBottom: 20
  },
  label: {
    marginBottom: 10,
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  areaInput: {
    flex: 1,
    minHeight: FontScale(40),
    padding: 10,
    alignItems: 'center',
    color: Colors.textColor_white_2,
    fontSize: FontScale(14)
  },
  btnContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    flex: 1,
    minHeight: 40
  },
  btn: {
    flex: 1,
    height: 40,
    borderRadius: 3,
    backgroundColor: Colors.bgColor_48_49_59,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
    // fontWeight: 'bold'
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
    // fontWeight: 'bold'
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  },
  text22: {
    fontSize: FontScale(22),
    color: Colors.textColor_255_255_238
    // fontWeight: 'bold'
  },
  icon: {
    width: 43,
    height: 43,
    borderRadius: 25,
    margin: 10
  },
  amountWrapper: {
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  }
})

export default styles
