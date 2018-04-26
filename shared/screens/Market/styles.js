import { StyleSheet, Platform } from 'react-native'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT, TAB_BAR_HEIGHT, WidthPercent } from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.bgColor_27_27_26
  },
  headerContainer: {
    width: SCREEN_WIDTH,
    height: NAV_BAR_HEIGHT,
    backgroundColor: Colors.bgColor_27_27_26,
    paddingTop: Platform.OS === 'ios' ? 20 : 0
  },
  navButton: {
    width: 100, 
    height: 40, 
    paddingTop: 6, 
    marginLeft: 10, 
    alignItems: 'flex-start', 
    justifyContent: 'center'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text24: {
    fontSize: FontScale(24),
    color: Colors.textColor_255_255_238,
    fontWeight: 'bold'
  },
  text20: {
    fontSize: FontScale(20),
    color: Colors.textColor_FFFFEE
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_142_142_147
  },
  text13: {
    fontSize: FontScale(13),
    color: Colors.textColor_FFFFEE
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  },
  text17: {
    fontSize: FontScale(17),
    color: Colors.textColor_142_142_147
  },
  searchContainer: {
    width: (SCREEN_WIDTH - 30)*2/3,
    height: 40,
    marginVertical: 10,
    marginLeft: 15,
    paddingLeft: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.borderColor_41_41_38,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInputStyle: {
    width: (SCREEN_WIDTH-30)*2/3-40,
    height: 40,
    marginLeft: Platform.OS === 'ios' ? 11 : 7,
    color: Colors.textColor_FFFFEE,
    fontSize: FontScale(17)
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT - 44 - 20
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor_41_41_38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    height: 42
  },
  coin: {
    width: WidthPercent(30),
    height: 42,
    backgroundColor: Colors.bgColor_343434,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor_41_41_38,
  },
  headerTitle: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor_41_41_38,
    height: 25
  }
})

export default styles
