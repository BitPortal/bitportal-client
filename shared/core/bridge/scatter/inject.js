/* global WebViewBridge */

import Scatterdapp from './scatterdapp'

if (WebViewBridge) {
  let scatter = new Scatterdapp({ version: '9.3.0', identity: null })

  scatter.getIdentity().then(() => {
    window.scatter = scatter
    scatter = null
    document.dispatchEvent(new CustomEvent('scatterLoaded'))
  })

  const bitportal = require('./bridge').default
  window.bitportal = bitportal
  document.dispatchEvent(new CustomEvent('bitportalapi'))
}
