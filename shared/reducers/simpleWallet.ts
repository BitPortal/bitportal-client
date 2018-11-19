import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/simpleWallet'

const initialState = Immutable.fromJS({
  data: {},
  loading: false,
  loaded: false,
  error: null
})

export default handleActions(
  {
    [actions.loginSWAuthRequested](state) {
      return state.set('loading', true)
    },
    [actions.loginSWAuthSucceeded](state, action) {
      return state
        .set('loaded', true)
        .set('loading', false)
        .set('data', action.payload)
    },
    [actions.loginSWAuthFailed](state, action) {
      return state.set('error', action.payload).set('loading', false)
    },
    [actions.clearSWError](state) {
      return state
        .set('error', null)
        .set('loading', false)
        .set('loaded', false)
    }
  },
  initialState
)
