import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/news'

function* getNews(action: Action<NewsParams>) {
  try {
    const data = yield call(api.getNews, {
      _start: action.payload.startAt || 0,
      _limit: action.payload.limit || 10
    })
    yield put(actions.getNewsSucceeded(data))
  } catch (e) {
    yield put(actions.getNewsFailed(e.message))
  }
}

export default function* newsSaga() {
  yield takeEvery(String(actions.getNewsRequested), getNews)
}
