import 'node-libs-react-native/globals'
import 'crypto'
import 'intl'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/zh.js'
import 'core-js/es6/symbol'
import 'core-js/fn/symbol/iterator'
import { StatusBar } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { getInitialLang } from 'selectors/intl'
import { getInitialContact } from 'selectors/contact'
import { getInitialCurrency } from 'selectors/currency'
import { getInitialEOSNode } from 'selectors/eosNode'
import { startSingleApp, startTabBasedApp, registerScreens } from 'navigators'
import storage from 'utils/storage'
import Provider from 'components/Provider'
import configure from 'store'
import sagas from 'sagas'
import Colors from 'resources/colors'
import VersionNumber from 'react-native-version-number'
import SplashScreen from 'react-native-splash-screen'
import DeviceInfo from 'react-native-device-info'
import { ENV } from 'constants/env'
import { noop } from 'utils'

EStyleSheet.build({})

if (ENV === 'production') {
  global.console = {
    info: noop,
    log: noop,
    warn: noop,
    debug: noop,
    error: noop
  }

  require('ErrorUtils').setGlobalHandler(noop)
}

const runApp = async () => {
  let lang = await storage.getItem('bitportal_lang')
  if (!lang) {
    const deviceLang = DeviceInfo.getDeviceLocale()
    lang = deviceLang.indexOf('zh') !== -1 ? 'zh' : 'en'
  }
  const currency = await storage.getItem('bitportal_currency', true)
  let symbol, rate
  if (currency) {
    symbol = currency.symbol
    rate = currency.rate
  }
  const contact = await storage.getItem('bitportal_contact', true)
  const eosNode = await storage.getItem('bitportal_eosNode', true)
  let activeNode, customNodes
  if (eosNode) {
    activeNode = eosNode.activeNode
    customNodes = eosNode.customNodes
  }

  const store = configure({
    intl: getInitialLang(lang),
    contact: getInitialContact(contact),
    currency: getInitialCurrency(symbol, rate),
    eosNode: getInitialEOSNode(activeNode, customNodes)
  })

  registerScreens(store)
  store.runSaga(sagas)

  const localVersion = await storage.getItem('bitportal_version')
  const currentVersion = VersionNumber.appVersion

  if (localVersion === currentVersion) {
    startTabBasedApp(lang)
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
