import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  listContainer: {
    width: SCREEN_WIDTH,
    height: 50,
    borderBottomColor: Colors.mainThemeColor,
    borderBottomWidth: 1
    // backgroundColor: Colors.bgColor_30_31_37
    // backgroundColor: 'red'
  },
  bgContainer: {
    // justifyContent: 'flex-end',
    height: 120,
    width: SCREEN_WIDTH,
    // marginTop: NAV_BAR_HEIGHT - SCREEN_HEIGHT
    marginTop: -120,
    backgroundColor: Colors.minorThemeColor
  },
  scrollViewContainer: {
    width: SCREEN_WIDTH,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  menuItemWrapper: {
    flexDirection: 'column',
    width: SCREEN_WIDTH / 4,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    // backgroundColor: 'red',
    paddingHorizontal: 5

    // paddingVertical: 10
  },
  menuButton: {
    // backgroundColor: Colors.bgColor_27_27_26,
    // backgroundColor: 'red',
    height: 50,
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    height: 50,
    width: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: Colors.textColor_FFFFEE,
    fontSize: FontScale(12),
    marginVertical: 10,
    textAlign: 'center',
    minHeight: 30
    // backgroundColor: 'red'
  },
  between: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  text16: {
    fontSize: FontScale(16),
    fontWeight: 'normal',
    color: Colors.textColor_255_255_238
  },
  categoryIcon: {
    height: 25,
    width: 25
    // paddingRight: 10,
    // marginRight: 5
    // backgroundColor: 'red'
  }
})

export default styles
