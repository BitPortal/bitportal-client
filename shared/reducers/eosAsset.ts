import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/eosAsset'

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null,
  assetPrefs: []
})

export default handleActions(
  {
    [actions.getEOSAssetRequested](state) {
      return state.set('loading', true)
    },
    [actions.getEOSAssetSucceeded](state, action) {
      return state
        .set('loaded', true)
        .set('loading', false)
        .set(
          'data',
          action.payload.length === 0
            ? Immutable.fromJS({})
            : Immutable.fromJS(action.payload)
        )
      //parse with existing asset prefs
    },
    [actions.getEOSAssetFailed](state, action) {
      return state.set('error', action.payload).set('loading', false)
    },
    [actions.saveAssetPrefSucceeded](state, action) {
      return state.set('assetPrefs', Immutable.fromJS(action.payload))
    },
    [actions.getAssetPrefSucceeded](state, action) {
      return state.set('assetPrefs', Immutable.fromJS(action.payload))
    }
  },
  initialState
)
