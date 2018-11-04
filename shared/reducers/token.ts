import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/token'

const initialState = Immutable.fromJS({
  data: {},
  loading: false,
  loaded: false,
  error: null
})

export default handleActions(
  {
    [actions.getTokenDetailRequested](state) {
      return state.set('loading', true)
    },
    [actions.getTokenDetailSucceeded](state, action) {
      if (action.payload.length === 0) {
        return state
          .set('loaded', true)
          .set('loading', false)
          .set('data', Immutable.fromJS({}))
      }

      return state
        .set('loaded', true)
        .set('loading', false)
        .set('data', Immutable.fromJS(action.payload[0]))
    },
    [actions.getTokenDetailFailed](state, action) {
      return state.set('error', action.payload).set('loading', false)
    },
    [actions.clearToken](state) {
      return state.set('data', Immutable.fromJS({}))
    }
  },
  initialState
)
