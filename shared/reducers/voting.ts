import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/voting'

const initialState = Immutable.fromJS({
  data: {},
  loading: false,
  loaded: false,
  error: null,
  showSelected: false
})

export default handleActions({
  [actions.votingRequested] (state) {
    return state.set('loading', true)
  },
  [actions.votingSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false).set('data', Immutable.fromJS(action.payload)).set('showSelected', false)
  },
  [actions.votingFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.clearError] (state) {
    return state.set('error', null)
  },
  [actions.showSelected] (state, action) {
    return state.set('showSelected', true)
  },
  [actions.closeSelected] (state) {
    return !state.get('error') ? state.set('showSelected', false) : state
  }
}, initialState)
