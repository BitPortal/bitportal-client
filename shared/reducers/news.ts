import { handleActions } from 'redux-actions'
import Immutable from 'immutable'
import * as actions from 'actions/news'

const initialState = Immutable.fromJS({
  listData: [],
  listLoading: false,
  listError: null,

  bannerData: [],
  bannerLoading: false,
  bannerError: null,
})

export default handleActions({
  [actions.getNewsListRequested] (state, action) {
    return state.set('listLoading', true)
  },
  [actions.getNewsListSucceeded] (state, action) {
    return state
      .update('listData', data => data.concat(Immutable.fromJS(action.payload)))
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
