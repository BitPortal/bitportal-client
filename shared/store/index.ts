import { createStore, applyMiddleware, compose, Store } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import AsyncStorage from '@react-native-community/async-storage'
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux'
import rootReducer from 'reducers'
import { isBrowser, isMobile } from 'utils/platform'
import { ENV } from 'constants/env'

interface AppStore<S> extends Store<S> {
  runSaga?: any
  close?: any
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: null,
  blacklist: ['form', 'ui']
}

export default function configure(initialState: RootState = {}, history?: any): AppStore<RootState> {
  const sagaMiddleware = createSagaMiddleware()
  const routerMiddleware = createRouterMiddleware(history)
  const middlewares = !isMobile ? [routerMiddleware, sagaMiddleware] : [sagaMiddleware]
  const composeEnhancers = (ENV !== 'production' && isBrowser && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store: AppStore<RootState> = createStore(persistedReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)))

  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)

  if (module.hot) {
    module.hot.accept('reducers', () => {
      const nextReducer = require('reducers').default
      store.replaceReducer(nextReducer)
    })
  }

  store.persistor = persistStore(store)
  return store
}