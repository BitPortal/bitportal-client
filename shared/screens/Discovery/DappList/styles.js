import { StyleSheet } from 'react-native'
import Colors from 'resources/colors'
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_BAR_HEIGHT,
  TAB_BAR_HEIGHT,
  FontScale
} from 'utils/dimens'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainThemeColor
  },
  listContainer: {
    marginTop: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - NAV_BAR_HEIGHT - TAB_BAR_HEIGHT,
    backgroundColor: Colors.mainThemeColor
  },
  rowContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 14,
    backgroundColor: Colors.bgColor_30_31_37,
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
    fontWeight: 'bold',
    marginBottom: 5
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
    backgroundColor: Colors.bgColor_30_31_37,
    marginBottom: 1,
    marginTop: 10,
    paddingHorizontal: 20,
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
  }
})

export default styles
