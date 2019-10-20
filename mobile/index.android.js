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
import { registerCells } from 'navigators'
import Provider from 'components/Provider'
import { persistStore } from 'redux-persist'
import configure from 'store'
import sagas from 'sagas'

import Market from 'screens/Market'

EStyleSheet.build({})

const locale = 'zh'
const store = configure({ intl: { locale }})
store.runSaga(sagas)

const MarketScreen = () => (<Provider store={store}><Market /></Provider>)

AppRegistry.registerComponent('Market', () => MarketScreen)
