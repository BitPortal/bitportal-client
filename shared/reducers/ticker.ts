import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import {
  QUOTE_ASSETS,
  DEFAULT_SORT_FILTER,
  EXCHANGES,
  MARKET_CATEGORIES
} from 'constants/market';
import * as actions from 'actions/ticker';

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null,
  exchangeFilter: EXCHANGES[0],
  marketCategory: MARKET_CATEGORIES[0],
  quoteAssetFilter: QUOTE_ASSETS[EXCHANGES[0]][0],
  sortFilter: EXCHANGES.reduce(
    (filters, exchange) => ({ ...filters, [exchange]: DEFAULT_SORT_FILTER }),
    {}
  ),
  dataSource: {},
  currencyFilter: null,
  baseAsset: null,
  fromUserPull: false,
  listedExchange: [],
  currentPair: {},
  searchTerm: ''
});

export default handleActions(
  {
    [actions.getTickersRequested](state, action) {
      return state
        .set('loading', true)
        .set('fromUserPull', !!action.payload.fromUserPull);
    },
    [actions.getTickersSucceeded](state, action) {
      return state
        .set('loaded', true)
        .set('loading', false)
        .set('fromUserPull', false)
        .update('dataSource', (v: any) => {
          const tickers = action.payload;
          let newData = v;

          for (const ticker of tickers) {
            const { symbol } = ticker;
            newData = newData.set(symbol, Immutable.fromJS(ticker));
          }

          return newData;
        });
    },
    [actions.getTickersFailed](state, action) {
      return state
        .set('error', action.payload)
        .set('loading', false)
        .set('fromUserPull', false);
    },
    [actions.getPairListedExchangeRequested](state, action) {
      return state
        .set('loading', true)
        .set('fromUserPull', !!action.payload.fromUserPull);
    },
    [actions.getPairListedExchangeFailed](state, action) {
      return state
        .set('error', action.payload)
        .set('loading', false)
        .set('fromUserPull', false);
    },
    [actions.getPairListedExchangeSucceeded](state, action) {
      return state
        .set('loaded', true)
        .set('loading', false)
        .set('fromUserPull', false)
        .set('listedExchange', Immutable.fromJS(action.payload));
    },
    [actions.selectTickersByExchange](state, action) {
      return state
        .set('exchangeFilter', action.payload)
        .set('quoteAssetFilter', QUOTE_ASSETS[action.payload][0]);
    },
    [actions.selectTickersByQuoteAsset](state, action) {
      return state.set('quoteAssetFilter', action.payload);
    },
    [actions.selectTickersByCurrency](state, action) {
      return state.set('currencyFilter', action.payload);
    },
    [actions.selectBaseAsset](state, action) {
      return state.set('baseAsset', Immutable.fromJS(action.payload));
    },
    [actions.deleteListedExchange](state) {
      return state.set('listedExchange', Immutable.fromJS([]));
    },
    [actions.selectCurrentPair](state, action) {
      return state.set('currentPair', Immutable.fromJS(action.payload));
    },
    [actions.setSortFilter](state, action) {
      return state.setIn(
        ['sortFilter', action.payload.exchangeFilter],
        action.payload.sortFilter
      );
    },
    [actions.setSearchTerm](state, action) {
      return state.set('searchTerm', Immutable.fromJS(action.payload));
    },
    [actions.setMarketCategory](state, action) {
      return state.set('marketCategory', Immutable.fromJS(action.payload));
    }
  },
  initialState
);
