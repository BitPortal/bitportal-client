import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/eosAsset'

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null,
  searchValue: '',
  selectedAsset: []
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
    [actions.getEOSAssetFaild] (state, action) {
      return state.set('loaded', true).set('loading', false)
        .set('error', action.payload)
    },
    [actions.toggleEOSAsset] (state, action) {
      return state.update('selectedAsset', (v: any) => {
        const contract = action.payload.contract
        const index = v.findIndex((v: any) => v.get('contract') === contract)
        return index !== -1 ? v.filter((v: any) => v.get('contract') !== contract) : v.push(Immutable.fromJS(action.payload)).sortBy((v: any) => v.get('symbol'))
      })
    },
    [actions.setSearchValue](state, action) {
      return state.set('searchValue', action.payload)
    },
    [actions.resetSearchValue](state) {
      return state.set('searchValue', '')
    }
  },
  initialState
)
