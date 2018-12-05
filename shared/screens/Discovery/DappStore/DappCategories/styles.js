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
  scrollContainer: {
    width: SCREEN_WIDTH,
    minHeight: 50,
    // backgroundColor: Colors.bgColor_30_31_37
    backgroundColor: Colors.mainThemeColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  list: {
    width: FLOATING_CARD_WIDTH,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    height: 150,
    backgroundColor: Colors.minorThemeColor
  },
  dAppScrollViewContainer: {
    width: FLOATING_CARD_WIDTH,
    borderRadius: FLOATING_CARD_BORDER_RADIUS,
    // paddingVertical: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: Colors.minorThemeColor
    // paddingBottom: 20
    // flex: 1
  },
  listItem: {
    height: 60,
    width: FLOATING_CARD_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  categoryIcon: {
    height: 17,
    width: 17,
    backgroundColor: 'red',
    paddingRight: 10
  },
  row: {
    flexDirection: 'row'
  },
  title: {
    color: Colors.textColor_FFFFEE,
    fontSize: FontScale(15),
    fontWeight: 'bold'
  },
  iconTitleWrapper: {
    backgroundColor: 'yellow',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  }
})

export default styles
