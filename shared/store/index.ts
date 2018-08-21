import Immutable from 'immutable'
import { createStore, applyMiddleware, compose, Store } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux'
import rootReducer from 'reducers'
import { isBrowser, isMobile } from 'utils/platform'
import { ENV } from 'constants/env'

interface AppStore<S> extends Store<S> {
  runSaga?: any
  close?: any
}

if (ENV !== 'production') {
  const installDevTools = require('immutable-devtools')
  installDevTools(Immutable)
}

export default function configure(initialState: RootState = {}, history?: any): AppStore<RootState> {
  const sagaMiddleware = createSagaMiddleware()
  const routerMiddleware = createRouterMiddleware(history)
  const middlewares = !isMobile ? [routerMiddleware, sagaMiddleware] : [sagaMiddleware]
  const composeEnhancers = (ENV !== 'production' && isBrowser && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const store: AppStore<RootState> = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)))

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)

  if (module.hot) {
    module.hot.accept('reducers', () => {
      const nextReducer = require('reducers').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
