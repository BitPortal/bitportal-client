import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: 'rgba(0, 0, 0, 0)'

    // backgroundColor: 'red'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  positionStyle: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  image: {
    height: 18,
    width: 18
  },
  buttonWrapper: {
    width: 100,
    height: 120,
    backgroundColor: Colors.textColor_142_142_147,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  backStyle: {
    height: SCREEN_HEIGHT,
    top: -NAV_BAR_HEIGHT / 2
  }
})

export default styles
