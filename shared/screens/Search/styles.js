import { StyleSheet } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, WidthPercent } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.bgColor_27_27_26
  },
  navButton: {
    minWidth: 80, 
    height: 40, 
    paddingTop: 6, 
    marginLeft: 10, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  text20: {
    fontSize: FontScale(20),
    color: Colors.textColor_FFFFEE
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_93_207_242
  },
  text17: {
    fontSize: FontScale(17),
    color: Colors.textColor_142_142_147
  },
  searchContainer: {
    width: SCREEN_WIDTH - 30,
    height: 44,
    marginVertical: 10,
    marginLeft: 15,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.borderColor_41_41_38,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 19
  },
  textInputStyle: {
    width: SCREEN_WIDTH-44-30,
    height: 44,
    marginLeft: 9,
    color: Colors.textColor_FFFFEE,
    fontSize: FontScale(17)
  }
})

export default styles
