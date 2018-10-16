import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  passwordStrength: {
    height: 20,
    width: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  block: {
    width: 15,
    height: 4,
    marginLeft: 5,
    marginTop: 2
  },
  weak: {
    backgroundColor: '#ff4740'
  },
  middle: {
    backgroundColor: '#ffbe00'
  },
  strong: {
    backgroundColor: '#59b9e2'
  }
})
