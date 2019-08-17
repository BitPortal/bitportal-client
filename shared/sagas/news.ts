// import { call, put, takeEvery } from 'redux-saga/effects'
// import { Action } from 'redux-actions'
// import * as api from 'utils/api'
// import * as actions from 'actions/news'

// function* getNewsList(action: Action<NewsParams>) {
//   if (!action.payload) return

//   try {
//     const startAt = parseInt(action.payload.startAt, 10)
//     const limit = parseInt(action.payload.limit, 10)
//     const data = yield call(api.getNewsList, {
//       offset: startAt || 0,
//       limit: limit || 10,
//       status: 'published'
//     })
//     console.info('get news data from cms', data)
//     yield put(actions.updateNews({data, startAt, limit}))
//     yield put(actions.getNews.succeeded())
//   } catch (e) {
//     yield put(actions.getNews.failed(e.message))
//   }
// }

// export default function* newsSaga() {
//   yield takeEvery(String(actions.getNews.requested), getNewsList)
//   yield takeEvery(String(actions.getNews.refresh), getNewsList)
// }
