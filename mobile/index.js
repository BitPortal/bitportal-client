import 'node-libs-react-native/globals'
import 'crypto'
import 'intl'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/zh.js'
import { StatusBar, Platform } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { registerScreens } from 'screens'
import { startSingleApp, startTabBasedApp } from 'navigators'
import storage from 'utils/storage'
import { getInitialLang } from 'selectors/intl'
import { getInitialCurrency } from 'selectors/currency'
import configure from 'store'
import Provider from 'components/Provider'
import sagas from 'sagas'
import SplashScreen from 'react-native-splash-screen'
import Colors from 'resources/colors'
import messages from 'navigators/messages'
import VersionNumber from 'react-native-version-number'

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
  const tabLabels = messages[getInitialLang(lang).get('locale')]
  store.runSaga(sagas)
  registerScreens(store, Provider) // this is where you register all of your app's screens

  const localInfo = await storage.getItem('bitportal_welcome')
  const currentVersion = VersionNumber.appVersion
  const localVersion =  localInfo && JSON.parse(localInfo).localVersion
  if (localVersion && localVersion == currentVersion ) startTabBasedApp(tabLabels)
  else startSingleApp()

  // hide the splash screens
  Platform.OS === 'ios' && SplashScreen.hide()
}

const setStatusBarStyle = async () => {
  const statusBarMode = await storage.getItem('bitportal_status_bar') || Colors.statusBarMode
  // mode: 'light-content'/'default'
  StatusBar.setHidden(false, 'fade')
  StatusBar.setBarStyle(statusBarMode, true)
}

runApp()
setStatusBarStyle()
