import EStyleSheet from 'react-native-extended-stylesheet'

const styles = EStyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  selected: {
    width: '100%'
  },
  tableView: {
    flex: 1
  },
  swiper: {
    borderColor: '#CBCBCB',
    borderBottomWidth: 0,
    height: 220
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 4
  },
  slide: {
    backgroundColor: 'blue',
    width: '100%',
    height: 190,
    borderRadius: 10
  },
  slideBackground: {
    flex: 1,
    // width: null,
    // height: null,
    borderRadius: 10
  },
  slideText: {
    color: 'white',
    position: 'absolute'
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
