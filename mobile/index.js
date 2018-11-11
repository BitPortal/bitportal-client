import 'node-libs-react-native/globals'
import 'crypto'
import 'intl'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/zh.js'
import 'core-js/es6/symbol'
import 'core-js/fn/symbol/iterator'
import React from 'react'
import { StatusBar, Platform, AppRegistry } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { getInitialLang } from 'selectors/intl'
import { getInitialContact } from 'selectors/contact'
import { getInitialCurrency } from 'selectors/currency'
import { getInitialEOSNode } from 'selectors/eosNode'
import { getInitialEOSAsset } from 'selectors/eosAsset'
import { getInitialDapp } from 'selectors/dApp'
import { getInitialAppInfo } from 'selectors/appInfo'
import { startApp, startSingleApp, startTabBasedApp, registerScreens } from 'navigators'
import { Navigation } from 'react-native-navigation'
import storage from 'utils/storage'
import Provider from 'components/Provider'
import configure from 'store'
import sagas from 'sagas'
import Colors from 'resources/colors'
import VersionNumber from 'react-native-version-number'
// import KeyboardManager from 'react-native-keyboard-manager'
// import { getLocaleLanguage } from 'utils/language'
import { calculate } from 'utils/update'
import { ENV } from 'constants/env'
import { noop } from 'utils'
import AssetTableViewCell from 'components/TableViewCell/AssetTableViewCell'
import AssetBalanceTableViewCell from 'components/TableViewCell/AssetBalanceTableViewCell'
import WalletTableViewCell from 'components/TableViewCell/WalletTableViewCell'
import ProducerTableViewCell from 'components/TableViewCell/ProducerTableViewCell'
import MarketTableViewCell from 'components/TableViewCell/MarketTableViewCell'
import WalletCardCollectionViewCell from 'components/CollectionViewCell/WalletCardCollectionViewCell'
import FeaturedDappCollectionViewCell from 'components/CollectionViewCell/FeaturedDappCollectionViewCell'
import SmallDappCollectionViewCell from 'components/CollectionViewCell/SmallDappCollectionViewCell'
import LargeDappCollectionViewCell from 'components/CollectionViewCell/LargeDappCollectionViewCell'

EStyleSheet.build({})

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

  const lang = localLang || 'zh' // getLocaleLanguage()
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

  registerScreens(store, Provider)
  AppRegistry.registerComponent('AssetTableViewCell', () => AssetTableViewCell)
  AppRegistry.registerComponent('AssetBalanceTableViewCell', () => AssetBalanceTableViewCell)
  AppRegistry.registerComponent('WalletTableViewCell', () => WalletTableViewCell)
  AppRegistry.registerComponent('ProducerTableViewCell', () => ProducerTableViewCell)
  AppRegistry.registerComponent('MarketTableViewCell', () => MarketTableViewCell)
  AppRegistry.registerComponent('WalletCardCollectionViewCell', () => WalletCardCollectionViewCell)
  AppRegistry.registerComponent('FeaturedDappCollectionViewCell', () => FeaturedDappCollectionViewCell)
  AppRegistry.registerComponent('SmallDappCollectionViewCell', () => SmallDappCollectionViewCell)
  AppRegistry.registerComponent('LargeDappCollectionViewCell', () => LargeDappCollectionViewCell)

  store.runSaga(sagas)
  if (remoteVersion && calculate(remoteVersion) <= calculate(localVersion)) {
    startTabBasedApp(lang)
  } else {
    startSingleApp()
  }

  // Platform.OS === 'ios' && KeyboardManager.setEnableAutoToolbar(true)
}

const setStatusBarStyle = async () => {
  const statusBarMode = (await storage.getItem('bitportal_status_bar')) || Colors.statusBarMode
  StatusBar.setHidden(false, 'fade')
  StatusBar.setBarStyle(statusBarMode, true)
}

startApp(() => {
  runApp()
  setStatusBarStyle()
})
