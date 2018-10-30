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
    backgroundColor: Colors.mainThemeColor
  },
  contentContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.minorThemeColor,
    alignItems: 'center',
    width: '100%' - 30,
    minHeight: 100,
    margin: 15,
    padding: 20,
  },
  gradient: {
    borderRadius: 5,
    width: '100%',
    minHeight: 30,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
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
  content: {
    width: '85%',
    minHeight: FontScale(28),
    padding: 5,
    paddingLeft: 10,
    backgroundColor: Colors.mainThemeColor,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  copy: {
    padding: 10,
    marginLeft: 10,
  },
  btnContainer: {
    flex: 1,
    marginVertical: 20,
    flexDirection: 'row',
    minHeight: 40
  },
  btn: {
    flex: 1,
    height: 40,
    borderRadius: 3,
    backgroundColor: Colors.bgColor_48_49_59,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  }
})

export default styles
