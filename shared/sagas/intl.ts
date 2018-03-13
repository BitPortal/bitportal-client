import { takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import cookie from 'react-cookie'
import * as actions from 'actions/intl'
import { isMobile } from 'utils/platform'

function setLocale(action: Action<object>) {
  if (!isMobile) {
    cookie.save('dae_lang', action.payload, {
      path: '/',
      domain: process.env.APP_ENV === 'pre' || process.env.APP_ENV === 'production' ? 'dae.org' : 'szjys.com',
      expires: new Date(Date.now() + (3600 * 1000 * 24 * 365))
    })
  }
}

export default function* intlSaga() {
  yield takeEvery(String(actions.setLocale), setLocale)
}
