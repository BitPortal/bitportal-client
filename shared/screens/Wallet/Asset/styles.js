import EStyleSheet from 'react-native-extended-stylesheet'

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    flex: 1
  },
  actionButtons: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16
  },
  actionButton: {
    backgroundColor: '#EFEFF4',
    borderRadius: 10,
    height: 48,
    width: '50% - 24',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 17
  }
})

export default styles
