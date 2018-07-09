import 'node-libs-react-native/globals'
import 'crypto'
import 'intl'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/zh.js'
import { StatusBar, Platform } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { getInitialLang } from 'selectors/intl'
import { getInitialCurrency } from 'selectors/currency'
import { startSingleApp, startTabBasedApp, registerScreens } from 'navigators'
import storage from 'utils/storage'
import Provider from 'components/Provider'
import configure from 'store'
import sagas from 'sagas'
import Colors from 'resources/colors'
import VersionNumber from 'react-native-version-number'
import SplashScreen from 'react-native-splash-screen'

EStyleSheet.build({})

const runApp = async () => {
  const lang = await storage.getItem('bitportal_lang')
  const currency = await storage.getItem('bitportal_currency', true)
  let symbol, rate
  if (currency) {
    symbol = currency.symbol
    rate = currency.rate
  }

  const store = configure({ intl: getInitialLang(lang), currency: getInitialCurrency(symbol, rate) })
  registerScreens(store)
  store.runSaga(sagas)

  const localInfo = await storage.getItem('bitportal_welcome', true)
  const currentVersion = VersionNumber.appVersion
  const localVersion =  localInfo && localInfo.localVersion

  if (localVersion && localVersion === currentVersion) {
    startTabBasedApp(getInitialLang(lang).get('locale'))
  } else {
    startSingleApp()
  }

  SplashScreen.hide()
}

const setStatusBarStyle = async () => {
  const statusBarMode = await storage.getItem('bitportal_status_bar') || Colors.statusBarMode
  StatusBar.setHidden(false, 'fade')
  StatusBar.setBarStyle(statusBarMode, true)
}

runApp()
setStatusBarStyle()
