import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH, TAB_BAR_HEIGHT } from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    minHeight: 50,
    backgroundColor: Colors.bgColor_30_31_37
  },
  dAppWrapper: {
    flexDirection: 'column',
    width: SCREEN_WIDTH / 4,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5
    // backgroundColor: 'red'

    // paddingVertical: 10
  },
  dAppScrollViewContainer: {
    width: SCREEN_WIDTH,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  navButton: {
    minWidth: 100,
    height: 40,
    paddingTop: 6,
    marginLeft: 10
  },
  dAppButton: {
    // backgroundColor: Colors.bgColor_27_27_26,
    // backgroundColor: 'red',
    height: 50,
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  favoriteWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 10
  },
  favoriteStar: {
    height: 25,
    width: 25
  },
  icon: {
    height: 50,
    width: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  moreIcon: {
    height: 50,
    width: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
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
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_181_181_181
  },
  markdownContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    paddingBottom: TAB_BAR_HEIGHT
  },
  listTitle: {
    width: SCREEN_WIDTH,
    height: 40,
    paddingLeft: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: Colors.bgColor_30_31_37
  },
  title: {
    color: Colors.textColor_FFFFEE,
    fontSize: FontScale(12),
    marginVertical: 10
  },
  hairLine: {
    height: 2,
    backgroundColor: Colors.mainThemeColor
  }
})

export default styles
