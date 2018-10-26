import EStyleSheet from 'react-native-extended-stylesheet'
import Colors from 'resources/colors'
import { FontScale } from 'utils/dimens'
import { Platform, StyleSheet } from 'react-native'

export default EStyleSheet.create({
  formContainer: {
    flex: 1,
    width: '100% - 30',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: Colors.minorThemeColor
  },
  searchContainer: {
    width: '100% - 70',
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
    height: '100%',
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
    marginTop: 10,
    minHeight: 60,
    borderRadius: 5
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
    marginLeft: '90%',
  },
  errorBorder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.bgColor_239_47_95
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_255_255_238
  }
})