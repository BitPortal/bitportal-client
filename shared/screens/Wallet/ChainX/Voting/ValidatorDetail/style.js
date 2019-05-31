import EStyleSheet from 'react-native-extended-stylesheet'

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17
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
