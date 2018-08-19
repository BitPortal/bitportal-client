import { takeEvery, call, select } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import storage from 'utils/storage'
import * as actions from 'actions/contact'
import { pop } from 'utils/location'

function* addContact(action: Action<AddContactParams>) {
  if (!action.payload) return

  const contact = yield select((state: RootState) => state.contact.get('data'))
  yield call(storage.setItem, 'bitportal_contact', contact.toJS(), true)
  if (action.payload.componentId) pop(action.payload.componentId)
}

function* deleteContact() {
  const contact = yield select((state: RootState) => state.contact.get('data'))
  yield call(storage.setItem, 'bitportal_contact', contact.toJS(), true)
}

export default function* contactSaga() {
  yield takeEvery(String(actions.addContact), addContact)
  yield takeEvery(String(actions.deleteContact), deleteContact)
}
