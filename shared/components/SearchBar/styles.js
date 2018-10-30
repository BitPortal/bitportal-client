import { StyleSheet, Platform } from 'react-native'
import Colors from 'resources/colors'
import { FontScale } from 'utils/dimens'

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
    paddingVertical: 2,
    marginRight: 5,
    marginVertical: Platform.OS === 'ios' ? 2 : 10,
    alignItems: 'center',
    backgroundColor: 'red'
  },
  textInput: {
    color: Colors.textColor_181_181_181,
    paddingBottom: 0,
    paddingTop: 0
    // backgroundColor: 'red'
  },
  searchContainer: {
    width: '100%',
    height: FontScale(28),
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  searchFieldInput: {
    borderBottomColor: Colors.textColor_107_107_107,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 1,
    alignItems: 'center'
  },
  searchInput: {
    color: Colors.textColor_181_181_181,
    marginTop: Platform.OS === 'ios' ? 0 : 0,
    paddingTop: Platform.OS === 'ios' ? 0 : -10,
    width: '100%',
    height: FontScale(28)
  }
})

export default styles
