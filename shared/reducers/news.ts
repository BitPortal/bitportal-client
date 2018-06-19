import { handleActions } from 'redux-actions'
import Immutable from 'immutable'
import * as actions from 'actions/news'
const PAGE_LENGTH = 10

const initialState = Immutable.fromJS({
  listData: [],
  listError: null,
  nomore: false,
  isRefreshing: false,
  loadingMore: false,

  bannerData: [],
  bannerLoading: false,
  bannerError: null,
})

export default handleActions({
  [actions.getNewsListRequested] (state, action) {
    if (action.payload.loadingMore) return state.set('loadingMore', true)
    return state.set('isRefreshing', true)
  },
  [actions.getNewsListSucceeded] (state, action) {
    const length = Immutable.fromJS(action.payload.data).size;
    if (length === 0) {
      return state
        .set('nomore', true)
        .set('isRefreshing', false)
        .set('loadingMore', false)
    }
    if (action.payload.loadingMore) {
      return state
        .set('listData', (data: any) => data.concat(Immutable.fromJS(action.payload.data)))
        .set('nomore', length < PAGE_LENGTH)
        .set('loadingMore', false)
    }
    return state
      .update('listData', () => Immutable.fromJS(action.payload.data))
      .set('nomore', length < PAGE_LENGTH)
      .set('isRefreshing', false)
  },
  [actions.getNewsListFailed] (state, action) {
    return state.set('listError', action.payload).set('isRefreshing', false).set('loadingMore', false)
  },

  [actions.getNewsBannerRequested] (state) {
    return state.set('bannerLoading', true)
  },
  [actions.getNewsBannerSucceeded] (state, action) {
    return state
      .set('bannerData', Immutable.fromJS(action.payload))
      .set('bannerLoading', false)
  },
  [actions.getNewsBannerFailed] (state, action) {
    return state.set('bannerError', action.payload)
  }
}, initialState)
