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
    height: '100%',
    // backgroundColor: 'red',
    justifyContent: 'center'
  },
  searchWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
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
    marginVertical: Platform.OS === 'ios' ? 2 : 10,
    alignItems: 'center'
  },
  textInput: {
    color: Colors.textColor_181_181_181,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: 0,
    paddingTop: 0
  }
})

export default styles
