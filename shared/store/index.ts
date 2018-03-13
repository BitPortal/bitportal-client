import { createStore, applyMiddleware, compose, Store } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux'
import rootReducer from 'reducers'
import { isBrowser, isMobile } from 'utils/platform'

interface AppStore<S> extends Store<S> {
  runSaga?: any
  close?: any
}

export default function configure(initialState?: RootState, history?: any): AppStore<RootState> {
  const sagaMiddleware = createSagaMiddleware()
  const routerMiddleware = createRouterMiddleware(history)
  const middlewares = !isMobile ? [routerMiddleware, sagaMiddleware] : [sagaMiddleware]
  const composeEnhancers = (isBrowser && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares))) as AppStore<RootState>

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)

  // if (module.hot) {
  //   module.hot.accept('reducers', () => {
  //     const nextReducer = require('reducers').default
  //     store.replaceReducer(nextReducer)
  //   })
  // }

  return store
}
