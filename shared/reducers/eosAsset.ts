import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import { QUOTE_ASSETS } from 'constants/market'
import * as actions from 'actions/eosAsset'

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null,
  assetPrefs: []
  //TODO change to array
})

export default handleActions(
  {
    [actions.getEosAssetRequested](state, action) {
      return state.set('loading', true)
    },
    [actions.getEosAssetSucceeded](state, action) {
      console.log('getEosAssetSucceeded', action.payload)
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
    [actions.getEosAssetFailed](state, action) {
      return state.set('error', action.payload).set('loading', false)
    },
    [actions.saveAssetPref](state, action) {
      console.log('actions.saveAssetPref', action.payload)
      return state.set('assetPrefs', action.payload)
    }

    // [actions.saveAssetPref](state, action) {
    //   return state.update('data', (list: any) => list.map(item => item.set(
    //     'value',
    //     !!action.payload[item.get('symbol')]
    //           && action.payload[item.get('symbol')].value
    //   )
    //   )
    //   )
    // }
  },
  initialState
)
