import EStyleSheet from 'react-native-extended-stylesheet'

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    flex: 1
  },
  swiperContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 205,
    paddingLeft: 12,
    paddingRight: 12,
    minHeight: 1,
    minWidth: 1
  },
  swiper: {
    width: '100%',
    height: 205,
    flex: 1,
    overflow: 'visible',
    paddingVertical: 16,
    minHeight: 1,
    minWidth: 1
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: 'red',
    paddingHorizontal: 4,
    minHeight: 1,
    minWidth: 1
  },
  slide: {
    backgroundColor: 'blue',
    width: '100%',
    height: 190,
    borderRadius: 10
  },
  slideBackground: {
    flex: 1,
    width: null,
    height: null,
    borderRadius: 10
  },
  slideText: {
    color: 'white',
    position: 'absolute'
  },
  actionButtons: {
    width: '100%',
    height: 60,
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
  },
  tableView: {
    flex: 1,
    height: 180
  }
})

export default styles
