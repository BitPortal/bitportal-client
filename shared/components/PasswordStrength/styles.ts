import EStyleSheet from 'react-native-extended-stylesheet'
import { FontScale } from 'utils/dimens'

export default EStyleSheet.create({
  passwordStrength: {
    height: 20,
    minWidth: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  text14: {
    fontSize: FontScale(14)
  },
  weak: {
    color: 'rgb(255, 9, 0)'
  },
  middle: {
    color: 'rgb(255, 190, 0)'
  },
  strong: {
    color: 'rgb(54, 128, 192)'
  }
})