import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as form } from 'redux-form/es/immutable'
import intl from './intl'
import ticker from './ticker'
import wallet from './wallet'
import news from './news'
import balance from './balance'

export default combineReducers({
  router,
  form,
  intl,
  wallet,
  ticker,
  news,
  balance
})
