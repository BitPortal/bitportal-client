import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  TAB_BAR_HEIGHT
} from 'utils/dimens'

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
    alignItems: 'center'
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
    backgroundColor: Colors.bgColor_27_27_26,
    height: 60,
    width: 60,
    borderRadius: 10
  },
  icon: {
    height: 60,
    width: 60,
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
    fontSize: FontScale(14),
    fontWeight: 'bold',
    marginBottom: 5,
    paddingTop: 10
  },
  hairLine: {
    height: 2,
    backgroundColor: Colors.mainThemeColor
  }
})

export default styles
