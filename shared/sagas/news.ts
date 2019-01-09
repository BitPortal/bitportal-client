import { select, call, put, takeEvery } from 'redux-saga/effects'
import * as api from 'utils/api'
import * as actions from 'actions/news'
import storage from 'utils/storage'

function* getNewsBanner() {
  try {
    const lang = yield select((state: RootState) => state.intl.get('locale'))
    let data = yield call(api.getNewsBanner, { _sort: 'display_priority:desc', status: 'published', language: lang })
    // fall back to en
    if (data.length === 0) {
      data = yield call(api.getNewsBanner, { _sort: 'display_priority:desc', status: 'published', language: 'en' })
    }
    yield call(storage.mergeItem, 'bitportal_news_banner', { banners: data }, true)
    yield put(actions.getNewsBannerSucceeded(data))
  } catch (e) {
    yield put(actions.getNewsBannerFailed(e.message))
  }
}

function* getLocalBanners() {
  try {
    let store = yield call(storage.getItem, 'bitportal_news_banner', true)
    if (store && store.banners) {
      yield put(actions.getNewsBannerSucceeded(store.banners))
    }
  } catch (e) {
    yield put(actions.getNewsBannerFailed(e.message))
  }
}

export default function* newsSaga() {
  yield takeEvery(String(actions.getLocalBanners), getLocalBanners)
  yield takeEvery(String(actions.getNewsBannerRequested), getNewsBanner)
}
