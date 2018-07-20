

import React from 'react'
import { connect, Provider as ReduxProvider } from 'react-redux'
import { IntlProvider, addLocaleData } from 'react-intl'
import { Text } from 'react-native'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'

addLocaleData(en)
addLocaleData(zh)

const mapStateToProps = state => ({
  locale: state.intl.get('locale'),
  textComponent: Text
})

const ConnectedIntlProvider = connect(mapStateToProps)(IntlProvider)

const Provider = ({ store, children }) => (
  <ReduxProvider store={store}>
    <ConnectedIntlProvider>
      {children}
    </ConnectedIntlProvider>
  </ReduxProvider>
)

export default Provider
