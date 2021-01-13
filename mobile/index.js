import 'node-libs-react-native/globals'
import 'crypto'
import 'intl'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/zh.js'
import 'core-js/es6/symbol'
import 'core-js/fn/symbol/iterator'
import React from 'react'
import { AppRegistry } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import { startApp, startTabBasedApp, registerScreens } from 'navigators'
import { persistStore } from 'redux-persist'
// import DeviceInfo from 'react-native-device-info'
import configure from 'store'
import sagas from 'sagas'
import storage from 'utils/storage'
// import {polkaApi} from 'core/chain/polkadot'
import {defaultLocale} from 'resources/messages'
// import VersionNumber from 'react-native-version-number'

EStyleSheet.build({})

startApp(async () => {
  // const localLocale = await storage.getItem('bitportal_lang')
  // const deviceLocale = DeviceInfo.getDeviceLocale()
  const locale = defaultLocale
  // create polkadot ws
  // await polkaApi()
  const store = configure({ intl: { locale }})
  registerScreens(store)
  store.runSaga(sagas)
  startTabBasedApp(locale)
})
