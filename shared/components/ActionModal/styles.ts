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
  whiteListContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 5,
    minHeight: 40
  },
  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 20
  },
  textTipContainer: {
    marginVertical: 10,
    alignItems: 'center'
  },
  textTip: {
    fontSize: FontScale(15),
    color: Colors.textColor_255_76_118
  },
  titleSetting: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  contentContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    minHeight: 20
  },
  btn: {
    width: '20%',
    minHeight: 30,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  textContentDes: {
    width: '70%',
    minHeight: 20
  },
  textSettingDes: {
    width: '70%',
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15
  },
  settingContainer: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 20
  },
  switchContainer: {
    marginLeft: '10%',
    minHeight: 20
  },
  switch: {
    transform: [{ scaleX: .6 }, { scaleY: .6 }]
  },
  label: {
    fontSize: FontScale(14),
    color: Colors.textColor_255_255_238,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 100
  },
  whiteListView: {
    width: '100%',
    maxHeight: 200,
  },
  dataView: {
    width: '100% - 130',
    maxHeight: 150,
    marginBottom: 20
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
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
  },
  text15: {
    fontSize: FontScale(15),
    fontWeight: 'bold',
    color: Colors.textColor_255_255_238
  },
  text14: {
    fontSize: FontScale(14),
    color: Colors.textColor_107_107_107
  },
  text12: {
    fontSize: FontScale(12),
    color: Colors.textColor_255_255_238
  }
})

export default styles
