import EStyleSheet from 'react-native-extended-stylesheet'
import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH } from 'utils/dimens'
import { StyleSheet } from 'react-native'

export default EStyleSheet.create({
  formContainer: {
    width: '100%',
    paddingHorizontal: 32,
    paddingVertical: 20,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.bgColor_48_49_59
  },
  fieldInput: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.textColor_181_181_181,
    borderRadius: 2,
    flex: 1,
    minHeight: 40,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  input: {
    flex: 1,
    height: 40,
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14)
  },
  areaInput: {
    width: SCREEN_WIDTH-64,
    height: SCREEN_WIDTH/4-16,
    paddingHorizontal: 5,
    marginTop: 10,
    flexDirection: 'row',
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14),
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.textColor_181_181_181,
    borderBottomWidth: 0
  },
  fieldItem: {
    flexDirection: 'column',
    width: '100%'
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_89_185_226
  },
  submitButton: {
    marginTop: 3,
    backgroundColor: Colors.textColor_89_185_226,
    borderRadius: 3,
    paddingVertical: 12
  },
  disabled: {
    backgroundColor: Colors.textColor_181_181_181
  },
  submitButtonText: {
    color: 'white',
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
