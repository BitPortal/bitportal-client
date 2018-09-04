import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/transaction'

const initialState = Immutable.fromJS({
  data: [],
  detail: {},
  loading: false,
  loaded: false,
  error: null,
  position: -1,
  offset: -50,
  hasMore: true,
  detailLoading: false,
  detailLoaded: false,
  detailError: null,
  lastIrreversibleBlock: 0,
  loadAll: false,
  refresh: true
})

export default handleActions({
  [actions.getTransactionsRequested] (state, action) {
    return state.set('loading', true)
      .set('loadAll', !!action.payload.loadAll)
      .set('refresh', action.payload.position === -1)
  },
  [actions.getTransactionsSucceeded] (state, action) {
    const refresh = state.get('refresh')

    return state.set('loaded', true).set('loading', false)
      .set('hasMore', action.payload.hasMore)
      .set('position', action.payload.position)
      .set('lastIrreversibleBlock', action.payload.lastIrreversibleBlock)
      .update('data', (v: any) => refresh ? Immutable.fromJS(action.payload.actions) : v.concat(Immutable.fromJS(action.payload.actions)))
  },
  [actions.getTransactionsFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.getTransactionDetailRequested] (state) {
    return state.set('detailLoading', true)
  },
  [actions.getTransactionDetailSucceeded] (state, action) {
    return state.set('detailLoaded', true).set('detailLoading', false)
      .set('detail', Immutable.fromJS(action.payload))
  },
  [actions.getTransactionDetailFailed] (state, action) {
    return state.set('detailError', action.payload).set('detailLoading', false)
  },
  [actions.resetTransactionDetail] (state) {
    return state.set('detail', Immutable.fromJS({}))
  },
  [actions.resetTransaction] () {
    return initialState
  }
}, initialState)
