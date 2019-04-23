import { handleActions } from 'utils/redux'
import * as actions from 'actions/contact'

const initialState = {
  byId: {},
  allIds: [],
  activeId: null,
  selected: null
}

export default handleActions({
  [actions.addContact] (state, action) {
    const contact = action.payload

    state.byId[contact.id] = contact
    const index = state.allIds.findIndex((v: any) => v === contact.id)
    if (index === -1) state.allIds.push(contact.id)
  },
  [actions.deleteContact] (state, action) {
    const id = action.payload
    const index = state.allIds.findIndex((v: any) => v === id)
    state.allIds.splice(index, 1)
    delete state.byId[id]
  },
  [actions.setActiveContact] (state, action) {
    state.activeId = action.payload
  },
  [actions.setSelectedContact] (state, action) {
    if (!action.payload) {
      state.selected = null
    } else {
      state.selected = {}
      state.selected.id = action.payload.id
      state.selected.name = action.payload.name
      state.selected.chain = action.payload.chain
      state.selected.address = action.payload.address || action.payload.accountName
      if (action.payload.memo) state.selected.memo = action.payload.memo
    }
  }
}, initialState)
