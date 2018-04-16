/* @tsx */

import 'core-js/es6'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { ConnectedRouter } from 'react-router-redux'
import { CookiesProvider } from 'react-cookie'
import { renderRoutes, RouteConfig } from 'react-router-config'
import { createBrowserHistory } from 'history'
import storage from 'utils/storage'
import { getInitialLang } from 'selectors/intl'
import Transit from 'transit-immutable-js'
import Provider from 'components/Provider'
import * as bundles from 'routes/async'
import { errorLoading } from 'utils'
import configure from 'store'
import routes from 'routes'
import sagas from 'sagas'

const preloadedState = window.__PRELOADED_STATE__ && Transit.fromJSON(window.__PRELOADED_STATE__)
const preloadedChunks = window.__PRELOADED_CHUNKS__ || []
const browserHistory = createBrowserHistory()
const lang = storage.getItemSync('bitportal_lang')
const store = configure({ ...preloadedState, intl: getInitialLang(lang) }, browserHistory)
store.runSaga(sagas)

const renderApp = (routes: RouteConfig[]) => {
  (preloadedState ? ReactDOM.hydrate : ReactDOM.render)(
    <AppContainer warnings={false}>
      <CookiesProvider>
        <Provider store={store}>
          <ConnectedRouter history={browserHistory}>
            {renderRoutes(routes)}
          </ConnectedRouter>
        </Provider>
      </CookiesProvider>
    </AppContainer>,
    document.getElementById('app')
  )
}

async function runApp() {
  try {
    if (!window.Intl) {
      await import('intl'/* webpackChunkName: 'intl' */)
      await Promise.all([
        import('intl/locale-data/jsonp/en.js'/* webpackChunkName: 'en' */),
        import('intl/locale-data/jsonp/zh.js'/* webpackChunkName: 'zh' */)
      ])
      console.log('using intl polyfill')
    }

    if (preloadedChunks) {
      await Promise.all(preloadedChunks.map(
        chunk => bundles[chunk].loadComponent()
      ))
    }
  } catch (error) {
    errorLoading(error)
  }

  renderApp(routes)
}

if (module.hot) {
  module.hot.accept('routes', () => {
    const nextRoutes = require('routes').default
    renderApp(nextRoutes)
  })
}

runApp()
