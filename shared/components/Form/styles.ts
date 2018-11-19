import EStyleSheet from 'react-native-extended-stylesheet'
import Colors from 'resources/colors'
import { Platform, StyleSheet } from 'react-native'
import { FontScale, FLOATING_CARD_WIDTH, FLOATING_CARD_BORDER_RADIUS } from 'utils/dimens'

export default EStyleSheet.create({
  formContainer: {
    flex: 1,
    width: '100%-30',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 15,
    backgroundColor: Colors.minorThemeColor
  },
  searchContainer: {
    width: '100% - 70',
    minHeight: FontScale(28),
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4
  },
  fieldInput: {
    borderRadius: 5,
    backgroundColor: Colors.bgColor_48_49_59,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 1,
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  searchFieldInput: {
    minHeight: FontScale(24),
    paddingVertical: 10,
    backgroundColor: 'black',
    borderRadius: 3,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10
  },
  input: {
    flex: 1,
    height: FontScale(40),
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14),
    paddingLeft: Platform.OS === 'android' ? -4 : 0
  },
  searchInput: {
    color: Colors.textColor_181_181_181,
    height: '100%',
    flex: 2
  },
  areaInput: {
    flex: 1,
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14),
    marginTop: 5,
    minHeight: 60,
    borderRadius: 5,
    marginBottom: 5
  },
  fieldItem: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: 20
  },
  fieldInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  info: {
    marginBottom: 10
  },
  between: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  label: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  submitButton: {
    marginTop: 3,
    backgroundColor: Colors.textColor_89_185_226,
    borderRadius: 3,
    paddingVertical: 12,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  cancelButton: {
    marginTop: 3,
    backgroundColor: Colors.bgColor_48_49_56,
    borderRadius: 3,
    paddingVertical: 12,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  indicator: {
    marginLeft: 10
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: FontScale(14)
  },
  buttonText: {
    color: Colors.textColor_89_185_226,
    textAlign: 'center',
    fontSize: FontScale(14)
  },
  fieldError: {
    borderRadius: 5,
    backgroundColor: Colors.bgColor_239_47_95,
    flex: 1,
    height: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 10
  },
  triangle: {
    overflow: 'hidden',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderRightWidth: 6,
    borderLeftWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.bgColor_239_47_95,
    marginBottom: 4,
    marginLeft: '90%'
  },
  errorBorder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.bgColor_239_47_95
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_255_255_238
  },
  dropdownMenu: {
    width: '70%',
    flex: 1
  },
  dropdownMenuItem: {
    backgroundColor: Colors.bgColor_48_49_59,
    color: Colors.textColor_255_255_238,
    height: FontScale(40),
    fontSize: FontScale(14)
  },
  dropdownBox: {
    flex: 1
  }
})
