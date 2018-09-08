import { put, takeEvery } from 'redux-saga/effects'
import { ActionMeta } from 'redux-actions'
import * as eosAssetActions from 'actions/eosAsset'

function* onChange(action: ActionMeta<SearchEOSAssetParsms, FormMeta>) {
  const { form, field } = action.meta

  if (form === 'searchEOSAssetForm' && field === 'searchTerm') {
    yield put(eosAssetActions.searchEOSAssetRequested(action.payload))
  }
}

export default function* formSaga() {
  yield takeEvery('@@redux-form/CHANGE', onChange)
}
