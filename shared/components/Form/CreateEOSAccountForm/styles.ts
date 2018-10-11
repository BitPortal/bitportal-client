import EStyleSheet from 'react-native-extended-stylesheet'
import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH } from 'utils/dimens'

export default EStyleSheet.create({
  privateKeyBtn: {
    width: '100%',
    backgroundColor: Colors.minorThemeColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    paddingVertical: 2
  },
  terms: {
    width: SCREEN_WIDTH - 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15
  },
  termsBtn: {
    padding: 15,
    paddingRight: 10,
    marginLeft: -30,
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_181_181_181
  },
  image: {
    width: FontScale(16),
    height: FontScale(16)
  }
})
