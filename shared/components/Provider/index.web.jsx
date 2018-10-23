import React from 'react'
import { connect, Provider as ReduxProvider } from 'react-redux'
import { IntlProvider, addLocaleData } from 'react-intl'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'
import ko from 'react-intl/locale-data/ko'
import messages from 'resources/messages'

addLocaleData(en)
addLocaleData(zh)
addLocaleData(ko)

const mapStateToProps = state => ({
  locale: state.intl.get('locale'),
  messages: messages[state.intl.get('locale')]
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
