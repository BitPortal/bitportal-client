import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/dApp'

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null
})

export default handleActions(
  {
    [actions.getDappListRequested](state, action) {
      return state.set('loading', true)
    },
    [actions.getDappListSucceeded](state, action) {
      return state
        .set('loaded', true)
        .set('loading', false)
        .set(
          'data',
          action.payload.length === 0
            ? Immutable.fromJS({})
            : Immutable.fromJS(action.payload)
        )
    },
    [actions.getDappListFailed](state, action) {
      return state.set('error', action.payload).set('loading', false)
    }
  },
  initialState
)
