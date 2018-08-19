import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import { getInitialContact } from 'selectors/contact'
import * as actions from 'actions/contact'

export default handleActions({
  [actions.addContact] (state, action) {
    return state.update('data', (v: any) => v.unshift(Immutable.fromJS({
      id: v.reduce((maxId: number, contact: any) => Math.max(contact.get('id'), maxId), -1) + 1,
      eosAccountName: action.payload.eosAccountName,
      note: action.payload.note
    })))
  },
  [actions.deleteContact] (state, action) {
    return state.update('data', (v: any) => v.filter((v: any) => v.get('id') !== action.payload))
  }
}, getInitialContact())
