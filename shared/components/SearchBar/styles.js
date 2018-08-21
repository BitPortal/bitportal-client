import { StyleSheet, Platform } from 'react-native'
import {
  FontScale,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  TAB_BAR_HEIGHT
} from 'utils/dimens'
import Colors from 'resources/colors'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 0,
    right: 0,
    width: SCREEN_WIDTH
    // backgroundColor: 'red'
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10
  },
  searchBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 5,
    marginVertical: 2
  },
  textInput: {
    color: Colors.textColor_181_181_181,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  }
})

export default styles
