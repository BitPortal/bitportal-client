import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/news'

function* getNewsList(action: Action<NewsParams>) {
  if (!action.payload) return

  try {
    const data = yield call(api.getNewsList, {
      _sort: 'createdAt:desc',
      _start: action.payload.startAt || 0,
      _limit: action.payload.limit || 10
    })
    yield put(actions.getNewsListSucceeded({ data, loadingMore: action.payload.loadingMore }))
  } catch (e) {
    yield put(actions.getNewsListFailed(e.message))
  }
}

function* getNewsBanner() {
  try {
    const data = yield call(api.getNewsBanner, { _sort: 'display_priority:desc' })
    yield put(actions.getNewsBannerSucceeded(data))
  } catch (e) {
    yield put(actions.getNewsBannerFailed(e.message))
  }
}

export default function* newsSaga() {
  yield takeEvery(String(actions.getNewsListRequested), getNewsList)
  yield takeEvery(String(actions.getNewsBannerRequested), getNewsBanner)
}
