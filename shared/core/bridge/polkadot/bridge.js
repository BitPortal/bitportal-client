/* global WebViewBridge */

if (!window.ReactNativeWebView || !window.ReactNativeWebView.postMessage) {
  window.ReactNativeWebView = {
    postMessage: function(data) {
      window.webkit.messageHandlers.ReactNativeWebView.postMessage(String(data))
    }
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

const parseMessageId = function(text) {
  const re = /BITPORAL_BRIDGE_MESSAGE@(\\d|\\w)+@/g
  const found = text.match(re)
  return found && found[0]
}

const uuid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }
  return `BITPORAL_BRIDGE_MESSAGE@${s4()}_${s4()}_${s4()}_${s4()}_${s4()}_${new Date().getTime()}@`
}

const resolvers = {}

export const send = function(type, payload) {
  return new Promise(function(resolve, reject) {
    resolve = resolve || function(){}
    reject = reject || function(){}
    const messageId = uuid()
    resolvers[messageId] = { resolve, reject }
    WebViewBridge.send(JSON.stringify({ messageId, type, payload }))
  })
}

export const subscribe = function() {
  WebViewBridge.onMessage = function(message) {
    let action

    try {
      action = JSON.parse(message)
    } catch (error) {
      const messageId = parseMessageId(message)
      if (messageId) {
        resolvers[messageId].reject({ message: error.message })
        delete resolvers[messageId]
      }
      return
    }

    const messageId = action.messageId
    const payload = action.payload

    if (resolvers && resolvers[messageId]) {
      switch (action.type) {
        case 'actionSucceeded':
          resolvers[messageId].resolve(payload.data)
          delete resolvers[messageId]
          break
        case 'actionFailed':
          resolvers[messageId].reject(payload.error)
          delete resolvers[messageId]
          break
        default:
          break
      }
    }
  }
}

subscribe()

const enable = async (origin) => {
  alert(`polkadotext enable ${origin}`)

  return {
    accounts: {
      get: () => {
        send('getPolkadotAccounts')
      }
    },
    metadata: {},
    provider: {},
    signer: {}
  }
}

export function injectExtension (enable, { name, version }) {
  const windowInject = window

  windowInject.injectedWeb3 = windowInject.injectedWeb3 || {}

  windowInject.injectedWeb3[name] = {
    enable: (origin) => enable(origin),
    version
  }
}

function inject () {
  injectExtension(enable, {
    name: 'polkadot-js',
    version: '0.35.2-25'
  })
}

inject()

setTimeout(() => {
  alert('polkadotext injected')
}, 1000)
