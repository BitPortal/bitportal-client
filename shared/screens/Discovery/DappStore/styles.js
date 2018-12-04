import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import { FontScale, SCREEN_WIDTH, TAB_BAR_HEIGHT, FLOATING_CARD_WIDTH, FLOATING_CARD_BORDER_RADIUS } from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    minHeight: 50,
    // backgroundColor: Colors.bgColor_30_31_37
    backgroundColor: Colors.mainThemeColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dAppWrapper: {
    flexDirection: 'column',
    width: SCREEN_WIDTH / 4,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5

    // paddingVertical: 10
  },
  dAppScrollViewContainer: {
    width: FLOATING_CARD_WIDTH,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: Colors.minorThemeColor,
    height: 120
    // flex: 1
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
    // width: SCREEN_WIDTH,
    height: 40,
    paddingLeft: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: Colors.bgColor_30_31_37
  },
  title: {
    color: Colors.textColor_FFFFEE,
    fontSize: FontScale(15),
    fontWeight: 'bold'
  },
  hairLine: {
    height: 2,
    backgroundColor: Colors.mainThemeColor
  },
  moreText: {
    color: Colors.white,
    fontSize: FontScale(14),
    paddingHorizontal: 10
    // fontWeight: 'bold'
  },
  moreButton: {
    // backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 2,
    paddingRight: 14
  },
  sectionHeader: {
    width: SCREEN_WIDTH,
    height: 45,
    backgroundColor: Colors.mainThemeColor,
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
    paddingHorizontal: 0,
    paddingLeft: 15
    // justifyContent: 'space-between'
  },
  categoryIcon: {
    height: 17,
    width: 17,
    paddingRight: 10
  },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center' }
})

export default styles
