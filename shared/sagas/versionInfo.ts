import { call, put, takeEvery, select } from 'redux-saga/effects'
import * as actions from 'actions/versionInfo'
import * as api from 'utils/api'
import { update } from 'utils/update'

function* getVersionInfo() {
  try {
    let data = yield call(api.getVersionInfo)
    data = { 
      lastVersion: '1.1.1',
      requiredVersion: '0.0.0',
      force: false,
      features: { zh: 'chinese features', en: 'english features' },
      downloadUrl: { ios: 'https://www.baidu.com', android: 'https://www.baidu.com' }
    } 
    const locale = yield select((state: any) => state.intl.get('locale'))
    update(data, locale)
  } catch (e) {
    yield put(actions.getVersionInfoFailed(e.message))
  }
}


export default function* versionInfoSaga() {
  yield takeEvery(String(actions.getVersionInfoRequested), getVersionInfo)
}
    