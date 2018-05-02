import { call, put, takeEvery, select } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/ticker'

function* getTickers(action: Action<TickerParams>) {
  if (!action.payload) return
  try {
    const data = yield call(api.getTickers, action.payload)
    yield put(actions.getTickersSucceeded(data))
  } catch (e) {
    yield put(actions.getTickersFailed(e.message))
  }
}

function* selectTickersByExchange(action: Action<string>) {
  if (!action.payload) return

  const ticker = yield select((state: RootState) => state.ticker)
  const exchange = action.payload
  const quote_asset = ticker.get('quoteAssetFilter')
  const sort = ticker.get('sortFilter').get(exchange)
  yield put(actions.getTickersRequested({ exchange, quote_asset, sort, limit: 20 }))
}

function* selectTickersByQuoteAsset(action: Action<string>) {
  if (!action.payload) return

  const ticker = yield select((state: RootState) => state.ticker)
  const exchange = ticker.get('exchangeFilter')
  const quote_asset = action.payload
  const sort = ticker.get('sortFilter').get(exchange)
  yield put(actions.getTickersRequested({ exchange, quote_asset, sort, limit: 20 }))
}

export default function* tickerSaga() {
  yield takeEvery(String(actions.getTickersRequested), getTickers)
  yield takeEvery(String(actions.selectTickersByExchange), selectTickersByExchange)
  yield takeEvery(String(actions.selectTickersByQuoteAsset), selectTickersByQuoteAsset)
}