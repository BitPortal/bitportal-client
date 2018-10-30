import { StyleSheet } from 'react-native'
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  FLOATING_CARD_WIDTH,
  FLOATING_CARD_BORDER_RADIUS
} from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    // height: SCREEN_HEIGHT,
    backgroundColor: Colors.mainThemeColor,
    alignItems: 'center',
    marginBottom: 10
  },
  scrollContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT
  },
  cardContainer: {
    width: FLOATING_CARD_WIDTH,
    alignItems: 'center',
    minHeight: 200,
    // paddingVertical: 10,
    // paddingHorizontal: 25,
    backgroundColor: Colors.bgColor_30_31_37,
    borderRadius: FLOATING_CARD_BORDER_RADIUS
  },
  chartContainer: {
    width: FLOATING_CARD_WIDTH,
    height: 200,
    // justifyContent: "center",
    // alignItems: "center",
    // paddingVertical: 20,
    // marginVertical: 20,
    backgroundColor: Colors.bgColor_30_31_37
  },
  rangeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 4,
    width: FLOATING_CARD_WIDTH
  },
  rangeButtonWrapper: {
    padding: 6
  },
  spaceBetween: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text18: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  },
  text16: {
    fontSize: FontScale(16),
    color: Colors.textColor_149_149_149
  },
  headerText: {
    fontSize: FontScale(16),
    color: Colors.textColor_89_185_226
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row'
    // alignItems: 'center'
    // justifyContent: 'center'
  },
  tag: {
    minWidth: 60,
    borderRadius: 4,
    padding: 2,
    borderColor: Colors.textColor_89_185_226,
    borderWidth: 1,
    marginRight: 10
  }
})

export default styles
