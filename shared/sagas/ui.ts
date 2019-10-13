import assert from 'assert'
import { NativeModules } from 'react-native'
import { call, put, takeEvery } from 'redux-saga/effects'
import * as identityActions from 'actions/identity'
import { Action } from 'redux-actions'

function* recoverIdentitySucceeded(action: Action) {
  NativeModules.RecoverIdentityView.submitSucceeded()
}

function* recoverIdentityFailed(action: Action) {
  const message = action.payload
  NativeModules.RecoverIdentityView.submitFailed(message)
}

function* createIdentitySucceeded(action: Action) {
  const mnemonics = action.payload
  NativeModules.CreateIdentityView.submitSucceeded(mnemonics)
}

function* createIdentityFailed(action: Action) {
  const message = action.payload
  NativeModules.CreateIdentityView.submitFailed(message)
}

function* validateMnemonicsSucceeded(action: Action) {
  const mnemonics = action.payload
  NativeModules.BackupIdentityView.submitSucceeded()
}

function* validateMnemonicsFailed(action: Action) {
  const message = action.payload
  NativeModules.BackupIdentityView.submitFailed(message)
}

export default function* uiSaga() {
  yield takeEvery(String(identityActions.recoverIdentity.succeeded), recoverIdentitySucceeded)
  yield takeEvery(String(identityActions.recoverIdentity.failed), recoverIdentityFailed)
  yield takeEvery(String(identityActions.createIdentity.succeeded), createIdentitySucceeded)
  yield takeEvery(String(identityActions.createIdentity.failed), createIdentityFailed)
  yield takeEvery(String(identityActions.validateMnemonics.succeeded), validateMnemonicsSucceeded)
  yield takeEvery(String(identityActions.validateMnemonics.failed), validateMnemonicsFailed)
}
