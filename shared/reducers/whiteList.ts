import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/whiteList'

const initialState = Immutable.fromJS({
  value: false,
  password: '',
  dappList: [],
  selectedDapp: {
    dappName: '',
    dappUrl: '',
    accept: false,
    settingDisplay: false,
    settingEnabled: false
  },
  loading: false,
  loaded: false,
  error: null
})

export default handleActions(
  {
    [actions.switchWhiteListSucceeded](state, action) {
      return state.set('value', action.payload.value)
    },
    [actions.recordPassword](state, action) {
      return state.set('password', action.payload.password)
    }, 
    [actions.recordDappInfo](state, action) {
      return state
      .setIn(['selectedDapp', 'dappName'], action.payload.dappName)
      .setIn(['selectedDapp', 'dappUrl'], action.payload.dappUrl)
    },
    [actions.changeSettingEnabled](state, action) {
      return state.setIn(['selectedDapp', 'settingEnabled'], action.payload.settingEnabled)
    },
    [actions.changeSwitchSetting](state, action) {
      return state.setIn(['selectedDapp', 'settingDisplay'], action.payload.settingDisplay)
    },
    [actions.changeSwitchWhiteList](state, action) {
      return state
      .setIn(['selectedDapp', 'accept'], action.payload.accept)
      .setIn(['selectedDapp', 'settingDisplay'], false)
      .setIn(['selectedDapp', 'settingEnabled'], false)
    },
    [actions.recordDappList](state, action) {
      return state.set('dappList', Immutable.fromJS(action.payload.dappList))
    },
    [actions.initSelectedDapp](state, action) {
      return state
      .setIn(['selectedDapp', 'dappName'], action.payload.dappName)
      .setIn(['selectedDapp', 'dappUrl'], action.payload.dappUrl)
      .setIn(['selectedDapp', 'accept'], action.payload.accept)
      .setIn(['selectedDapp', 'settingDisplay'], action.payload.settingDisplay)
      .setIn(['selectedDapp', 'settingEnabled'], action.payload.settingEnabled)
    },
    [actions.resetSelectedDapp](state) {
      return state
      .setIn(['selectedDapp', 'dappName'], '')
      .setIn(['selectedDapp', 'dappUrl'], '')
      .setIn(['selectedDapp', 'accept'], false)
      .setIn(['selectedDapp', 'settingDisplay'], false)
      .setIn(['selectedDapp', 'settingEnabled'], false)
    }
  },
  initialState
)
