import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/assets'

/**
 * data: [
 *  { 
 *    enable: true, // 是否是当前使用钱包 同级只有一个能为true
 *    accountName: 'MyEOSWallet', // 钱包名
 *    assetsList: [
 *      { assetName: 'EOS', amount: 25.20,    enable: true }, // enable 表示是否激活 EOS钱包中EOS不能删  
 *      { assetName: 'UIP', amount: 12321.90, enable: true },
 *      { assetName: 'OTC', amount: 2552.50,  enable: true },
 *      ...
 *    ] 
 *  },
 *  { 
 *    enable: false,
 *    accountName: 'MyBTCWallet', 
 *    assetsList: [...] 
 *  },
 *  { 
 *    enable: false,
 *    accountName: 'MyETHWallet', 
 *    assetsList: [...] 
 *  }
 *  ...
 * ] 
 */ 

const initialState = Immutable.fromJS({
  data: [
    { 
      enable: true, // 是否是当前使用钱包 同级只有一个能为true
      accountName: 'EOS-1', // 钱包名
      assetsList: [
        { assetName: 'EOS', amount: 223425.20,    enable: true }, // enable 表示是否激活 EOS钱包中EOS不能删  
        { assetName: 'UIP', amount: 12321.90, enable: true },
        { assetName: 'OTC', amount: 2552.50,  enable: true },
      ] 
    },
    { 
      enable: false,
      accountName: 'EOS-BackUp', 
      assetsList: [
        { assetName: 'EOS', amount: 0.00,    enable: true }
      ] 
    },
    { 
      enable: false,
      accountName: 'EOS-New', 
      assetsList: [
        { assetName: 'EOS', amount: 0.00,    enable: true } 
      ]
    }
  ],
  loading: false,
  loaded: false,
  error: null
})

export default handleActions({
  [actions.getAssetsInfo] (state, action) {
    return state.set('data', action.payload)
  }
}, initialState)
