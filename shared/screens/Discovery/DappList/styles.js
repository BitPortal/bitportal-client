import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  FontScale,
  FLOATING_CARD_WIDTH,
  FLOATING_CARD_BORDER_RADIUS
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    backgroundColor: Colors.mainThemeColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainer: {
    width: FLOATING_CARD_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor,
    marginBottom: 80
    // backgroundColor: 'red'
    // alignItems: 'center'
  },
  inlineListContainer: {
    marginTop: 0,
    width: SCREEN_WIDTH,
    // height: SCREEN_HEIGHT - NAV_BAR_HEIGHT,
    backgroundColor: Colors.mainThemeColor,
    marginBottom: 10
  },

  rowContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 14,
    backgroundColor: Colors.bgColor_30_31_37,
    backgroundColor: 'red',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    height: FontScale(80)
    // marginBottom: 2
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 4
  },
  right: {
    flexDirection: 'column',
    marginLeft: 10,
    flex: 1
  },
  title: {
    color: Colors.textColor_FFFFEE,
    fontSize: FontScale(15),
    fontWeight: 'bold'
  },
  moreText: {
    color: Colors.textColor_84_164_207,
    fontSize: FontScale(14)
    // fontWeight: 'bold'
  },
  moreButton: {
    // backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 2
  },

  itemSeperator: {
    height: 1,
    width: SCREEN_WIDTH
  },
  subTitle: {
    color: Colors.textColor_149_149_149,
    fontSize: FontScale(13),
    marginTop: 5
  },
  infoArea: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listTitle: {
    width: SCREEN_WIDTH,
    height: 40,
    paddingLeft: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: Colors.bgColor_30_31_37,
    marginBottom: 1
  },
  sectionHeader: {
    width: SCREEN_WIDTH,
    height: 40,
    marginBottom: 1,
    marginTop: 10,
    justifyContent: 'center'
  },
  moreSectionHeader: {
    width: SCREEN_WIDTH,
    height: 40,
    backgroundColor: Colors.bgColor_30_31_37,
    flexDirection: 'row',
    marginBottom: 1,
    marginTop: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center'
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
  row: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  categoryIcon: {
    height: 17,
    width: 17,
    paddingRight: 10,
    marginRight: 5
    // backgroundColor: 'red'
  },
  noResults: {
    width: FLOATING_CARD_WIDTH,
    backgroundColor: Colors.minorThemeColor,
    minHeight: 150,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: FLOATING_CARD_BORDER_RADIUS
  },
  noResultIcon: {
    height: 100,
    width: 100,
    marginBottom: 20
  }
})

export default styles
