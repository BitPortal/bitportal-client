/* global chrome */

import { Store } from 'react-chrome-redux'
import Transit from 'transit-immutable-js'
import * as walletActions from 'actions/wallet'

const store = new Store({
  portName: 'BITPORTAL',
  serializer: (payload: any) => Transit.toJSON(payload),
  deserializer: (payload: any) => Transit.fromJSON(payload)
})

const injectScript = () => {
  const s = document.createElement('script')
  s.src = chrome.extension.getURL('scripts/inject.js')

  const documentElement = document.head || document.documentElement
  documentElement.appendChild(s)

  s.onload = () => {
    s.remove()
  }
}

const supportedActions = [
  'getEOSAccountInfo',
  'getEOSCurrencyBalance',
  'getEOSActions',
  'getEOSTransaction',
  'transferEOSAsset',
  'voteEOSProducers',
  'pushEOSAction',
  'eosAuthSign',
  'getCurrentWallet',
  'getAppInfo'
]

store.ready().then(() => {
  injectScript()

  supportedActions.forEach((action) => {
    document.addEventListener(`${action}_request`, function() {
      // chrome.runtime.sendMessage(e.detail.message, response => console.log(response))
      store.dispatch(walletActions.syncWalletRequested())
    })
  })
})
