import EStyleSheet from 'react-native-extended-stylesheet'
import Colors from 'resources/colors'
import { FontScale, ifIphoneX } from 'utils/dimens'

const styles = EStyleSheet.create({
  mask: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  outside: {
    width: '100%',
    flexGrow: 1
  },
  content: {
    width: '100%',
    alignSelf: 'flex-end',
    ...ifIphoneX({
      paddingBottom: 34
    }, {
      paddingBottom: 0
    })
  },
  header: {
    width: '100%',
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: Colors.mainThemeColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  },
  close: {
    minWidth: 50,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    width: '100%',
    height: '40%',
    backgroundColor: Colors.mainThemeColor
  },
  accountItemContainer: {
    width: '100%-40',
    minHeight: 40,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 4,
    backgroundColor: Colors.minorThemeColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  contentContainerStyle: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.mainThemeColor,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text15: {
    fontSize: FontScale(15),
    fontWeight: 'bold',
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_107_107_107
  }
})

export default styles
