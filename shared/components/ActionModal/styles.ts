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
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: FontScale(18),
    color: Colors.textColor_255_255_238
  },
  close: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 50,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: Colors.minorThemeColor,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 14
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 8,
    minHeight: 40
  },
  label: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 100
  },
  dataView: {
    width: '100% - 130',
    maxHeight: 150
  },
  dataViewAction: {
    marginBottom: 20
  },
  actionData: {
    marginTop: 10,
    marginBottom: 10
  },
  actionDataItem: {
    flex: 1,
    flexDirection: 'row'
  },
  actionDataLabel: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  actionDataValue: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238
  },
  data: {
    width: '100% - 130',
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  highlight: {
    fontSize: FontScale(20),
    fontWeight: 'bold'
  },
  buttonItem: {
    justifyContent: 'center'
  },
  submitButton: {
    width: '100%',
    height: 40,
    borderRadius: 3,
    backgroundColor: Colors.textColor_89_185_226,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButtonText: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238,
  },
  disabled: {
    backgroundColor: Colors.textColor_181_181_181
  },
  indicator: {
    marginLeft: 10
  }
})

export default styles
