import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import { QUOTE_ASSETS, DEFAULT_SORT_FILTER } from 'constants/market'
import * as actions from 'actions/ticker'

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null,
  exchangeFilter: 'BINANCE',
  quoteAssetFilter: QUOTE_ASSETS.BINANCE[0],
  sortFilter: {
    BINANCE: DEFAULT_SORT_FILTER,
    BITTREX: DEFAULT_SORT_FILTER,
    OKEX: DEFAULT_SORT_FILTER,
    HUOBIPRO: DEFAULT_SORT_FILTER,
    POLONIEX: DEFAULT_SORT_FILTER,
    GDAX: DEFAULT_SORT_FILTER
  },
  dataSource: {},
  currencyFilter: null,
  baseAsset: null,
  fromUserPull: false,
  listedExchange: [],
  currentPair: {}
})

export default handleActions(
  {
    [actions.getTickersRequested](state, action) {
      // console.log('actions.getTickersRequested action.payload', action.payload);
      return state
        .set('loading', true)
        .set('fromUserPull', !!action.payload.fromUserPull)
    },
    [actions.getTickersSucceeded](state, action) {
      return state
        .set('loaded', true)
        .set('loading', false)
        .set('fromUserPull', false)
        .update('dataSource', (v: any) => {
          const tickers = action.payload
          let newData = v

          for (const ticker of tickers) {
            const { symbol, ...data } = ticker
            newData = newData.set(symbol, Immutable.fromJS(data))
          }

          return newData
        })
    },
    [actions.getTickersFailed](state, action) {
      return state
        .set('error', action.payload)
        .set('loading', false)
        .set('fromUserPull', false)
    },
    [actions.getPairListedExchangeRequested](state, action) {
      console.log(
        'actions.getPairListedExchangeRequested action.payload',
        action.payload
      )
      return state
        .set('loading', true)
        .set('fromUserPull', !!action.payload.fromUserPull)
    },
    [actions.getPairListedExchangeFailed](state, action) {
      return state
        .set('error', action.payload)
        .set('loading', false)
        .set('fromUserPull', false)
    },
    [actions.getPairListedExchangeSucceeded](state, action) {
      return state
        .set('loaded', true)
        .set('loading', false)
        .set('fromUserPull', false)
        .set('listedExchange', Immutable.fromJS(action.payload))
    },
    [actions.selectTickersByExchange](state, action) {
      return state
        .set('exchangeFilter', action.payload)
        .set('quoteAssetFilter', QUOTE_ASSETS[action.payload][0])
    },
    [actions.selectTickersByQuoteAsset](state, action) {
      return state.set('quoteAssetFilter', action.payload)
    },
    [actions.selectTickersByCurrency](state, action) {
      return state.set('currencyFilter', action.payload)
    },
    [actions.selectBaseAsset](state, action) {
      // console.log('actions.selectBaseAsset', action.payload);
      return state.set('baseAsset', Immutable.fromJS(action.payload))
    },
    [actions.deleteListedExchange](state, action) {
      return state.set('listedExchange', Immutable.fromJS([]))
    },
    [actions.selectCurrentPair](state, action) {
      // console.log('action.selectCurrentPair', action.payload.toJS());
      return state.set('currentPair', Immutable.fromJS(action.payload))
    },
    [actions.setSortFilter](state, action) {
      return state.updateIn(
        ['sortFilter', action.payload.exchangeFilter],
        (sortFilter: any) => action.payload.sortFilter
      )
    }
  },
  initialState
)
