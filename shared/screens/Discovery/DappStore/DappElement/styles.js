import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH, TAB_BAR_HEIGHT, FLOATING_CARD_WIDTH } from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    minHeight: 50,
    backgroundColor: Colors.bgColor_30_31_37
  },
  dAppWrapper: {
    flexDirection: 'column',
    width: FLOATING_CARD_WIDTH / 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    paddingHorizontal: 3
    // backgroundColor: 'red'
    // paddingVertical: 10
  },
  dAppWrapperRowItem: {
    height: 70,
    flexDirection: 'row',
    width: FLOATING_CARD_WIDTH,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
    paddingHorizontal: 15
    // backgroundColor: 'red'
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
  rowFavoriteWrapper: {
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
  hotNewWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 10
  },
  hotNewTag: {
    height: 12,
    width: 30
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
  iconWrapper: {
    padding: 0
    // backgroundColor: 'red'
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
    color: Colors.white,
    // fontWeight: 'bold',
    fontSize: FontScale(14),
    marginTop: 6,
    marginBottom: 3
  },
  categoryText: {
    color: Colors.textColor_141_142_148,
    fontSize: FontScale(10)
    // marginTop: 2
  },
  hairLine: {
    height: StyleSheet.hairlineWidth,
    width: FLOATING_CARD_WIDTH,
    backgroundColor: Colors.mainThemeColor
    // backgroundColor: 'red'
  },
  titleTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3
    // backgroundColor: 'brown'
  },
  titleSideLabel: {
    margin: 5,
    height: 12,
    width: 30
  },
  rowTextWrapper: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    // backgroundColor: 'red',
    marginRight: 30
  },
  rowTitle: {
    color: Colors.white,
    textAlignVertical: 'center',
    // fontWeight: 'bold',
    fontSize: FontScale(14)
    // marginTop: 6
  },
  rowDescription: {
    color: Colors.textColor_141_142_148,
    fontSize: FontScale(12),
    marginTop: 2
  }
})

export default styles
