import 'node-libs-react-native/globals'
import 'crypto'
import 'intl'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/zh.js'
import 'core-js/es6/symbol'
import 'core-js/fn/symbol/iterator'
import { StatusBar, Platform } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { getInitialLang } from 'selectors/intl'
import { getInitialContact } from 'selectors/contact'
import { getInitialCurrency } from 'selectors/currency'
import { getInitialEOSNode } from 'selectors/eosNode'
import { getInitialEOSAsset } from 'selectors/eosAsset'
import { getInitialDapp } from 'selectors/dApp'
import { getInitialAppInfo } from 'selectors/appInfo'
import { startSingleApp, startTabBasedApp, registerScreens } from 'navigators'
import { Navigation } from 'react-native-navigation'
import storage from 'utils/storage'
import Provider from 'components/Provider'
import configure from 'store'
import sagas from 'sagas'
import Colors from 'resources/colors'
import VersionNumber from 'react-native-version-number'
import SplashScreen from 'react-native-splash-screen'
import KeyboardManager from 'react-native-keyboard-manager'
import { getLocaleLanguage } from 'utils/language'
import { calculate } from 'utils/update'
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
  const [
    localLang,
    currency,
    contact,
    eosNode,
    selectedEOSAsset,
    storedFavoriteDapps,
    remoteVersion
  ] = await Promise.all([
    storage.getItem('bitportal_lang'),
    storage.getItem('bitportal_currency', true),
    storage.getItem('bitportal_contact', true),
    storage.getItem('bitportal_eosNode', true),
    storage.getItem('bitportal_toggledEOSAsset', true),
    storage.getItem('bitportal_favoriteDapps', true),
    storage.getItem('bitportal_version')
  ])

  const lang = localLang || getLocaleLanguage()
  const symbol = currency && currency.symbol
  const rate = currency && currency.rate
  const activeNode = eosNode && eosNode.activeNode
  const customNodes = eosNode && eosNode.customNodes
  const localVersion = VersionNumber.appVersion
  const platform = Platform.OS

  const store = configure({
    intl: getInitialLang(lang),
    contact: getInitialContact(contact),
    currency: getInitialCurrency(symbol, rate),
    eosNode: getInitialEOSNode(activeNode, customNodes),
    eosAsset: getInitialEOSAsset(selectedEOSAsset),
    dApp: getInitialDapp(storedFavoriteDapps),
    appInfo: getInitialAppInfo(platform, localVersion)
  })

  registerScreens(store)
  store.runSaga(sagas)
  if (remoteVersion && calculate(remoteVersion) <= calculate(localVersion)) {
    startTabBasedApp(lang)
  } else {
    startSingleApp()
  }

  SplashScreen.hide()
  Platform.OS === 'ios' && KeyboardManager.setEnableAutoToolbar(true);
}

const setStatusBarStyle = async () => {
  const statusBarMode = (await storage.getItem('bitportal_status_bar')) || Colors.statusBarMode
  StatusBar.setHidden(false, 'fade')
  StatusBar.setBarStyle(statusBarMode, true)
}

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions({
    modalPresentationStyle:'fullScreen',
    topBar: {
      visible: false,
      animate: false,
      height: 0
    },
    layout: {
      screenBackgroundColor: Colors.mainThemeColor,
      backgroundColor: Colors.minorThemeColor,
      orientation: ['portrait']
    },
    bottomTabs: {
      visible: true,
      drawBehind: true,
      animate: Platform.OS !== 'ios',
      backgroundColor: Colors.minorThemeColor,
      tabColor: 'gray',
      selectedTabColor: Colors.textColor_89_185_226,
      hideShadow: false,
      titleDisplayMode: 'alwaysShow'
    }
  })
  runApp()
})

setStatusBarStyle()
