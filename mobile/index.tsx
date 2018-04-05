/* @tsx */

import 'intl'
import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import Provider from 'components/Provider'
import AppWithNavigationState from 'navigators'
import configure from 'store'
import sagas from 'sagas'

EStyleSheet.build({})
const store = configure()
store.runSaga(sagas)

export default class App extends Component<{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('bitportal', () => App)
