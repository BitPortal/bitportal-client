import { StyleSheet } from 'react-native';
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, WidthPercent } from 'utils/dimens';
import Colors from 'resources/colors';
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
  text13: {
    fontSize: FontScale(13),
    color: Colors.textColor_FFFFEE
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
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.borderColor_41_41_38,
    flexDirection: 'row',
    alignItems: 'center'
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT - 44 - 20
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor_41_41_38,
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    height: 42
  },
  coin: {
    width: WidthPercent(30),
    height: 42,
    backgroundColor: Colors.bgColor_343434,
    alignItems: 'center',
    flexDirection: 'row'
  }
})

export default styles
