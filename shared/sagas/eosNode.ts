import { takeEvery, call, select } from 'redux-saga/effects'
import * as actions from 'actions/eosNode'
import storage from 'utils/storage'

function* saveStateToStorage() {
  const eosNode = yield select((state: RootState) => state.eosNode)
  yield call(storage.setItem, 'bitportal_eosNode', eosNode.delete('defaultNodes').toJS(), true)
}

export default function* eosNodeSaga() {
  yield takeEvery(String(actions.setActiveNode), saveStateToStorage)
  yield takeEvery(String(actions.addCustomNode), saveStateToStorage)
  yield takeEvery(String(actions.deleteCustomNode), saveStateToStorage)
}
