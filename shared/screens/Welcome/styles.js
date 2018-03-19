import { StyleSheet } from 'react-native'
import { SCREEN_HEIGHT, SCREEN_WIDTH, FontScale } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.bgColor_F3F4F9
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: FontScale(17)
  }
})

export default styles;