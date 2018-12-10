import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { SCREEN_WIDTH, FontScale } from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: 140,
    marginBottom: 5
  },
  dot: {
    width: 0,
    height: 0,
    borderRadius: 2,
    marginHorizontal: 2,
    backgroundColor: Colors.textColor_white_4
  },
  activeDot: {
    width: 0,
    height: 0,
    borderRadius: 4,
    marginHorizontal: 2,
    backgroundColor: Colors.bgColor_FAFAFA
  },
  title: {
    fontSize: FontScale(22),
    color: Colors.textColor_FFFFEE,
    fontWeight: 'bold'
  },
  subTitle: {
    fontSize: FontScale(16),
    color: Colors.textColor_149_149_149
  },
  background: {
    position: 'absolute',
    height: 140,
    width: '100%',
    top: 0,
    left: 0
  },
  paginationStyle: {
    marginBottom: -15
  }
})

export default styles
