import assert from 'assert'
import { takeEvery, call } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import storage from 'utils/storage'
import * as actions from 'actions/contact'
import { pop } from 'utils/location'
import { typeOf } from 'utils'

function* addContact(action: Action<AddContactParams>) {
  const eosAccountName = action.payload.eosAccountName
  const note = action.payload.note
  let contacts = yield call(storage.getItem, 'bitportal_contact', true)
  if (!contacts || typeOf(contacts) !== 'Array') contacts = []
  const contact = {
    eosAccountName,
    note,
    id: contacts.reduce((maxId, contact) => Math.max(contact.id, maxId), -1) + 1
  }
  const newContacts = [contact, ...contacts]
  yield call(storage.setItem, 'bitportal_contact', newContacts, true)
  if (action.payload.componentId) pop(action.payload.componentId)
}

function* deleteContact(action: Action<DeleteContactParams>) {
  const deleteIndex = action.payload
  const contacts = yield call(storage.getItem, 'bitportal_contact', true)
  assert(contacts && typeOf(contacts) === 'Array', 'Invalid contact')
  const newContacts = contacts.filter((contact: any) => contact.id !== deleteIndex)
  yield call(storage.setItem, 'bitportal_contact', newContacts, true)
}

export default function* contactSaga() {
  yield takeEvery(String(actions.addContact), addContact)
  yield takeEvery(String(actions.deleteContact), deleteContact)
}
