import EStyleSheet from 'react-native-extended-stylesheet'
import { Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4'
  },
  profile: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.16)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 140
  },
  info: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%'
  },
  username: {
    fontSize: 22
  },
  email: {
    fontSize: 16,
    color: '#8A8A8F'
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 15
  }
})