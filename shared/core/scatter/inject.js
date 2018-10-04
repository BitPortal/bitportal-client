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

  let scatter = new Scatterdapp({})
  scatter.getIdentity().then(() => {
    window.scatter = scatter
    scatter = null
    document.dispatchEvent(new CustomEvent('scatterLoaded'))
  })
}
