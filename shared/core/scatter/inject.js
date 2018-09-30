/* global WebViewBridge */

// import { EncryptedStream } from './EncryptedStream'
// import IdGenerator from './IdGenerator'
// import * as PairingTags from './PairingTags'
// import * as NetworkMessageTypes from './NetworkMessageTypes'
if (WebViewBridge) {
  const Scatterdapp = require('./scatterdapp').default
  // const send = require('./bridge').send

  // send('getOrRequestIdentity').then((identity) => {
  // })
  window.scatter = new Scatterdapp({})
  window.scatter.getIdentity().then(() => {
    document.dispatchEvent(new CustomEvent('scatterLoaded'))
  })
}
