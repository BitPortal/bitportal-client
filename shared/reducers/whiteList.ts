import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/whiteList'

const initialState = Immutable.fromJS({
  value: false, // 设置页面的白名单功能开关
  password: '', // 临时属性 不本地存储
  dappList: [], // 和账户绑定 记录授权过的白名单列表
  selectedDapp: { // 当前进行中的dapp
    dappName: '', // 当前进行中的dapp名字
    dappUrl: '', // 当前进行中的dappurl
    iconUrl: '', // 当前进行中的dapp icon url
    accept: false, // 当前进行中的dapp是否开启了白名单  如开启则只需输一次密码即可
    settingDisplay: false, // 当前进行中的dapp是否展示高级设置
    settingEnabled: false // 当前进行中的dapp是否开启了高级设置
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
      .setIn(['selectedDapp', 'iconUrl'], action.payload.iconUrl)
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
      .setIn(['selectedDapp', 'iconUrl'], action.payload.iconUrl)
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
