import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import { getInitialEOSNode } from 'selectors/eosNode'
import * as actions from 'actions/eosNode'

export default handleActions({
  [actions.setActiveNode] (state, action) {
    return state.set('activeNode', action.payload)
  },
  [actions.addCustomNode] (state, action) {
    return state.update('customNodes', (v: any) => v.unshift(Immutable.fromJS({
      id: v.reduce((maxId: number, node: any) => Math.max(node.get('id'), maxId), -1) + 1,
      url: action.payload.url
    })))
  },
  [actions.deleteCustomNode] (state, action) {
    return state.update('customNodes', (v: any) => v.filter((v: any) => v.get('id') !== action.payload))
  }
}, getInitialEOSNode())
