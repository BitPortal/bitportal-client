import { handleActions } from 'utils/redux'
import * as actions from 'actions/ui'

export const initialState = {
  searchBarEnabled: false,
  searchText: ''
}

export default handleActions({
  [actions.showSearchBar] (state, action) {
    state.searchBarEnabled = true
  },
  [actions.hideSearchBar] (state, action) {
    state.searchBarEnabled = false
  }
}, initialState)
