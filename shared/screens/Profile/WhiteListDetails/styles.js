import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT } from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT,
    alignItems: 'center'
  },
  listItem: {
    width: SCREEN_WIDTH,
    height: 64
  },
  extraListItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 20,
    borderBottomColor: Colors.mainThemeColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: Colors.bgColor_30_31_37
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10
  },
  switch: {
    transform: [{ scaleX: .8 }, { scaleY: .8 }],
    marginRight: 20
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    height: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    backgroundColor: Colors.mainThemeColor,
    borderBottomColor: Colors.minorThemeColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_181_181_181
  }
})

export default styles
