import { handleActions } from 'redux-actions'
import Immutable from 'immutable'
import * as actions from 'actions/socket'

const initialState = Immutable.fromJS({
  connecting: false,
  connected: false,
  actionQueue: [],
  error: null
})

export default handleActions({
  [actions.init] (state) {
    return state.set('connecting', true)
      .set('connected', false)
  },
  [actions.connectSucceeded] (state) {
    return state.set('connecting', false)
      .set('connected', true)
  },
  [actions.connectFailed] (state) {
    return state.set('connecting', false)
      .set('connected', false)
  },
  [actions.disconnect] (state) {
    return state.set('connecting',false)
      .set('connected',false)
  },
  [actions.addActionToQueue] (state, action) {
    return state.update('actionQueue', (v: any) => v.push(Immutable.fromJS(action.payload)))
  },
  [actions.clearQueueActions] (state) {
    return state.set('actionQueue', Immutable.fromJS([]))
  }
}, initialState)
