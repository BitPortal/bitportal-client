import 'core-js/es6'
import 'intl'
import 'intl/locale-data/jsonp/en.js'
import 'intl/locale-data/jsonp/zh.js'
import React from 'react'
import ReactDOM from 'react-dom'
import { ConnectedRouter } from 'react-router-redux'
import { renderRoutes } from 'react-router-config'
import { createMemoryHistory } from 'history'
import { Store } from 'react-chrome-redux'
import Transit from 'transit-immutable-js'
import Provider from 'components/Provider'
import routes from 'routes'

const memoryHistory = createMemoryHistory()

const store = new Store({
  portName: 'BITPORTAL',
  serializer: (payload: any) => Transit.toJSON(payload),
  deserializer: (payload: any) => Transit.fromJSON(payload)
})

store.ready().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={memoryHistory}>
        {renderRoutes(routes)}
      </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
  )
})
