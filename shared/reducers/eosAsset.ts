import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import { QUOTE_ASSETS } from 'constants/market'
import * as actions from 'actions/eosAsset'

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null
})

export default handleActions(
  {
    [actions.getEosAssetRequested](state, action) {
      return state.set('loading', true)
    },
    [actions.getEosAssetSucceeded](state, action) {
      if (action.payload.length === 0) {
        return state
          .set('loaded', true)
          .set('loading', false)
          .set('data', Immutable.fromJS({}))
      }

      return state
        .set('loaded', true)
        .set('loading', false)
        .set('data', Immutable.fromJS(action.payload))
    },
    [actions.getEosAssetFailed](state, action) {
      return state.set('error', action.payload).set('loading', false)
    }
  },
  initialState
)
