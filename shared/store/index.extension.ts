import Immutable from 'immutable'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux'
import rootReducer from 'reducers'
import { ENV } from 'constants/env'

if (ENV !== 'production') {
  const installDevTools = require('immutable-devtools')
  installDevTools(Immutable)
}

export default function configure(initialState: RootState = {}, history?: any) {
  const sagaMiddleware = createSagaMiddleware()
  const routerMiddleware = createRouterMiddleware(history)
  const middlewares = [routerMiddleware, sagaMiddleware]
  const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares)) as any
  store.runSaga = sagaMiddleware.run
  store.close = () => store.dispatch(END)
  return store
}
