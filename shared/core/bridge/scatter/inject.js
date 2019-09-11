/* global WebViewBridge */

import Scatterdapp from './scatterdapp'

window.ReactNativeWebView = {
  postMessage: function(data) {
    window.webkit.messageHandlers.ReactNativeWebView.postMessage(String(data))
  }
}

window.WebViewBridge = {
  onMessage: function() {
    return null
  },
  send: function(data) {
    window.ReactNativeWebView.postMessage(data)
  }
}
var event = new Event('WebViewBridge')
window.dispatchEvent(event)

let scatter = new Scatterdapp({ version: '9.3.0', identity: null })

scatter.getIdentity().then(() => {
  window.scatter = scatter
  scatter = null
  document.dispatchEvent(new CustomEvent('scatterLoaded'))
})

const bitportal = require('./bridge').default
window.bitportal = bitportal
document.dispatchEvent(new CustomEvent('bitportalapi'))
