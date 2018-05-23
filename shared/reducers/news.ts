import { handleActions } from 'redux-actions'
import Immutable from 'immutable'
import * as actions from 'actions/news'
const PAGE_LENGTH = 10

const initialState = Immutable.fromJS({
  listData: [],
  listLoading: false,
  listError: null,
  nomore: false,
  isRefreshing: false,

  bannerData: [],
  bannerLoading: false,
  bannerError: null,
})

export default handleActions({
  [actions.getNewsListRequested] (state, action) {
    return state.set('listLoading', true)
  },
  [actions.getNewsListSucceeded] (state, action) {
    const length = Immutable.fromJS(action.payload.data).size;
    if (length === 0) {
      return state
        .set('nomore', true)
        .set('listLoading', false)
    }
    if (action.payload.isRefresh) {
      return state
        .set('listData', Immutable.fromJS(action.payload.data))
        .set('nomore', length < PAGE_LENGTH)
        .set('listLoading', false)
    }
    return state
      .update('listData', data => {
        return data.concat(Immutable.fromJS(action.payload.data))
      })
      .set('nomore', length < PAGE_LENGTH)
      .set('listLoading', false)
  },
  [actions.getNewsListFailed] (state, action) {
    return state.set('listError', action.payload)
  },

  [actions.getNewsBannerRequested] (state, action) {
    return state.set('bannerLoading', true)
  },
  [actions.getNewsBannerSucceeded] (state, action) {
    return state
      .set('bannerData', Immutable.fromJS(action.payload))
      .set('bannerLoading', false)
  },
  [actions.getNewsBannerError] (state, action) {
    return state.set('bannerError', action.payload)
  }
}, initialState)
