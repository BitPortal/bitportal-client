import EStyleSheet from 'react-native-extended-stylesheet'

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    height: '100%'
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 50,
    width: 347
  },
  list: {
    marginTop: 35,
    backgroundColor: 'white',
    paddingRight: 15,
    paddingLeft: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#C8C7CC',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C8C7CC'
  },
  listItem: {
    height: 44,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C8C7CC'
  }
})

export default styles
