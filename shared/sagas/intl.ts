import { takeEvery, call } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import storage from 'utils/storage'
import * as actions from 'actions/intl'
import { startTabBasedApp, setDefaultOptions } from 'navigators'

function* setLocale(action: Action<object>) {
  const locale = action.payload
  yield call(storage.setItem, 'bitportal_lang', locale, false, {
    path: '/',
    domain: 'bitportal.io',
    expires: new Date(Date.now() + (3600 * 1000 * 24 * 365))
  })
}

export default function* intlSaga() {
  yield takeEvery(String(actions.setLocale), setLocale)
}
