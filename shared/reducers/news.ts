import { handleActions } from 'utils/redux'
import * as actions from 'actions/news'
const PAGE_LENGTH = 10

const initialState = {
  listData: [],
  allIds: [],
  listError: null,
  nomore: false,
  isRefreshing: false,
  loadingMore: false
}

export default handleActions({
  [actions.updateNews] (state, action) {
    state.listData = action.payload.data.data
  }
}, initialState)
