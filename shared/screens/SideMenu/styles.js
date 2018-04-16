import { StyleSheet } from 'react-native'
import { SCREEN_HEIGHT, SCREEN_WIDTH, FontScale } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH*0.8,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.minorThemeColor
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    marginTop: 20,
    paddingLeft: 15,
    height: 30
  },
  segment: {
    flexDirection: 'row',
    marginVertical: 10,
    width: SCREEN_WIDTH*0.8,
    height: 30
  },
  btnStyle: {
    flex: 1
  },
  divider: {
    height: FontScale(15),
    width: 1,
    backgroundColor: Colors.bgColor_474746
  },
  list: {
    width: SCREEN_WIDTH*0.8,
    height: SCREEN_HEIGHT - 120
  },
  listItem: {
    flexDirection: 'row',
    paddingLeft: 15,
    width: SCREEN_WIDTH*0.8,
    height: 30
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_FFFFEE
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_FFFFEE
  }
})

export default styles