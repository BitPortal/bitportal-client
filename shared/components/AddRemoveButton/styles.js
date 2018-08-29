import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  TAB_BAR_HEIGHT,
  FontScale
} from 'utils/dimens'

const styles = StyleSheet.create({
  image: {
    height: 22,
    width: 22
  },
  buttonWrapper: {
    width: '30%',
    height: '17%',
    backgroundColor: Colors.textColor_142_142_147,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  }
})

export default styles
