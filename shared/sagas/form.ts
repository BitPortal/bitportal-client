import { put, takeEvery } from 'redux-saga/effects'
import { ActionMeta } from 'redux-actions'

function* onChange(action: ActionMeta<SearchEOSAssetParsms, FormMeta>) {
  const { form, field } = action.meta
}

export default function* formSaga() {
  yield takeEvery('@@redux-form/CHANGE', onChange)
}
