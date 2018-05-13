import { handleActions } from 'redux-actions'
import Immutable from 'immutable'
import * as actions from 'actions/news'

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  error: null
})

export default handleActions({
  [actions.getNewsRequested] (state, action) {
    return state.set('loading', true)
  },
  [actions.getNewsSucceeded] (state, action) {
    return state
      .update('data', data => data.concat(Immutable.fromJS(action.payload)))
      .set('loading', false)
  },
  [actions.getNewsFailed] (state, action) {
    return state.set('error', action.payload)
  }
}, initialState)
