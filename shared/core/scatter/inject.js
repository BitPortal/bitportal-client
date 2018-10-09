/* global WebViewBridge */

// import { EncryptedStream } from './EncryptedStream'
// import IdGenerator from './IdGenerator'
// import * as PairingTags from './PairingTags'
// import * as NetworkMessageTypes from './NetworkMessageTypes'
if (WebViewBridge) {
  const Scatterdapp = require('./scatterdapp').default
  let scatter = new Scatterdapp({ version: '6.1.10', identity: null })
  scatter.getIdentity().then(() => {
    window.scatter = scatter
    scatter = null
    document.dispatchEvent(new CustomEvent('scatterLoaded'))
  })

  const bitportal = require('./bridge').default
  window.bitportal = bitportal
  document.dispatchEvent(new CustomEvent('bitportalapi'))
}
