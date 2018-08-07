import EStyleSheet from 'react-native-extended-stylesheet'
import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH } from 'utils/dimens'

export default EStyleSheet.create({
  terms: {
    width: SCREEN_WIDTH - 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15
  },
  termsBtn: {
    padding: 15,
    marginLeft: -30,
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_181_181_181
  }
})
