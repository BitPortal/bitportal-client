import EStyleSheet from 'react-native-extended-stylesheet'
import Colors from 'resources/colors'
import { FontScale } from 'utils/dimens'
import { StyleSheet, Platform } from 'react-native'

export default EStyleSheet.create({
  formContainer: {
    width: '100%',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.bgColor_48_49_59
  },
  fieldInput: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.textColor_181_181_181,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 1,
    alignItems: 'center'
  },
  input: {
    flex: 1,
    height: 40,
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14),
    paddingLeft: Platform.OS === 'android' ? -4 : 0
  },
  areaInput: {
    flex: 1,
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14),
    marginTop: 10,
    minHeight: 80,
    padding: 10,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.textColor_181_181_181
  },
  fieldItem: {
    flexDirection: 'column',
    width: '100%'
  },
  fieldInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: FontScale(14),
    color: Colors.textColor_89_185_226,
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
  disabled: {
    backgroundColor: Colors.textColor_181_181_181
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
    color: '#ff4740',
    minHeight: 20,
    marginVertical: 4,
    fontSize: FontScale(14)
  }
})
