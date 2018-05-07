import { StyleSheet, Platform } from 'react-native'
import Colors from 'resources/colors'
import { 
  FontScale, 
  SCREEN_WIDTH, 
  SCREEN_HEIGHT, 
  NAV_BAR_HEIGHT, 
  TAB_BAR_HEIGHT
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  }
})

export default styles
