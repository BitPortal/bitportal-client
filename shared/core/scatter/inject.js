/* global WebViewBridge */

// import { EncryptedStream } from './EncryptedStream'
// import IdGenerator from './IdGenerator'
// import * as PairingTags from './PairingTags'
// import * as NetworkMessageTypes from './NetworkMessageTypes'
if (WebViewBridge) {
  const Scatterdapp = require('./scatterdapp').default
  const bitportal = require('./bridge').default
  window.bitportal = bitportal
  document.dispatchEvent(new CustomEvent('bitportalapi'))

  window.scatter = new Scatterdapp({ version: '6.1.10', identity: null })
  document.dispatchEvent(new CustomEvent('scatterLoaded'))
  // scatter.getIdentity().then(() => {
  //   window.scatter = scatter
  //   window.ScatterEOS = scatter
  //   scatter = null
  // })
}
