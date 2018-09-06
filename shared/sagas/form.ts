import { put, takeEvery, select } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as eosAssetActions from 'actions/eosAsset'

function* onChange(action: Action<string, { form: string, field: string }>) {
  const { form, field } = action.meta

  if (form === 'searchEOSAssetForm' && field === 'searchTerm') {
    yield put(eosAssetActions.searchEOSAssetRequested(action.payload))
  }
}

export default function* formSaga() {
  yield takeEvery('@@redux-form/CHANGE', onChange)
}
