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
import configure from 'store'
import sagas from 'sagas'
// import VersionNumber from 'react-native-version-number'

EStyleSheet.build({})

startApp(() => {
  const store = configure()
  registerScreens(store)
  store.runSaga(sagas)
  startTabBasedApp()
})
