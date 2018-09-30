import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/eosAsset'

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  searching: false,
  error: null,
  toggledAsset: [],
  searchResult: []
})

export default handleActions(
  {
    [actions.getEOSAssetRequested] (state) {
      return state.set('loading', true)
    },
    [actions.getEOSAssetSucceeded] (state, action) {
      return state.set('loaded', true).set('loading', false)
        .set('data', Immutable.fromJS(action.payload))
    },
    [actions.getEOSAssetFailed] (state, action) {
      return state.set('loaded', true).set('loading', false)
        .set('error', action.payload)
    },
    [actions.toggleEOSAsset] (state, action) {
      return state.update('toggledAsset', (v: any) => {
        const contract = action.payload.contract
        const symbol = action.payload.symbol
        const index = v.findIndex((v: any) => v.get('contract') === contract && v.get('symbol') === symbol)
        return index !== -1 ? v.update(index, (v: any) => v.update('selected', (v: any) => !v).merge(Immutable.fromJS(action.payload))) : v.push(Immutable.fromJS({ ...action.payload, selected: true })).sortBy((v: any) => v.get('symbol'))
      })
    },
    [actions.searchEOSAssetRequested] (state) {
      return state.set('searching', true)
    },
    [actions.searchEOSAssetSucceeded] (state, action) {
      return state.set('searching', false)
      .set('searchResult', Immutable.fromJS(action.payload))
    },
    [actions.searchEOSAssetFailed] (state) {
      return state.set('searching', false)
    },
    [actions.clearSearch] (state) {
      return state.set('searchResult', initialState.get('searchResult')).set('searching', false)
    },
    [actions.resetEOSAsset] () {
      return initialState
    }
  },
  initialState
)
