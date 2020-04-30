import React from 'react'
import { connect, Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { IntlProvider, addLocaleData } from 'react-intl'
import { Text } from 'react-native'
import Loading from 'components/Loading'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'
import ko from 'react-intl/locale-data/ko'
import messages from 'resources/messages'
import { DarkModeProvider } from 'utils/darkMode'

addLocaleData(en)
addLocaleData(zh)
// addLocaleData(ko)

const mapStateToProps = state => ({
  locale: state.intl.locale,
  messages: messages[state.intl.locale],
  textComponent: Text
})

const ConnectedIntlProvider = connect(mapStateToProps)(IntlProvider)

const Provider = ({ store, children }) => {
  const { persistor, ...pureStore } = store

  return (
    <DarkModeProvider>
      <ReduxProvider store={pureStore}>
        <ConnectedIntlProvider>
          {children}
        </ConnectedIntlProvider>
      </ReduxProvider>
    </DarkModeProvider>
  )
}

export const PersistProvider = ({ store, children }) => {
  const { persistor, ...pureStore } = store

  return (
    <DarkModeProvider>
      <ReduxProvider store={pureStore}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <ConnectedIntlProvider>
            {children}
          </ConnectedIntlProvider>
        </PersistGate>
      </ReduxProvider>
    </DarkModeProvider>
  )
}

export default Provider
