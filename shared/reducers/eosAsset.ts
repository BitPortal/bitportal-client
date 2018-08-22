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
        const contract = action.payload
        const selected = v.includes(contract)
        return selected ? v.filter((v: any) => v !== contract) : v.push(contract)
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
