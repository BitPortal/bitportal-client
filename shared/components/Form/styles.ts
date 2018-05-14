import EStyleSheet from 'react-native-extended-stylesheet'
import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { FontScale } from 'utils/dimens'

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
  fieldItem: {
    flexDirection: 'column',
    width: '100%'
  },
  fieldInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#b5b5b5',
    marginBottom: 1
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_89_185_226
  },
  input: {
    flex: 1,
    marginRight: 10,
    height: 30,
    color: Colors.textColor_255_255_238,
    fontSize: FontScale(14)
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
    color: 'red',
    minHeight: 20,
    fontSize: FontScale(14)
  }
})
