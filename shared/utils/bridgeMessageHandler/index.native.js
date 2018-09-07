const messageHandler = `
if (WebViewBridge) {
  const parseMessageId = function(text) {
    const re = /BITPORAL_BRIDGE_MESSAGE@(\\d|\\w)+@/g
    const found = text.match(re)
    return found && found[0]
  }

  const uuid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return 'BITPORAL_BRIDGE_MESSAGE@' + s4() + "_" + s4() + "_" + s4() + "_" + s4() + "_" + s4() + "_" + new Date().getTime() + "@"
  }

  let callbacks = {}

  const sendRequest = function(type, payload, onSuccess, onError) {
    onSuccess = onSuccess || function(){}
    onError = onError || function(){}
    const messageId = uuid()
    callbacks[messageId] = { onSuccess, onError }
    WebViewBridge.send(JSON.stringify({ messageId, type, payload }))
  }

  WebViewBridge.onMessage = function(message) {
    let action

    try {
      action = JSON.parse(message)
    } catch (error) {
      const messageId = parseMessageId(message)
      if (messageId) {
        callbacks[messageId].onError({ message: error.message})
        delete callbacks[messageId]
      }
      return
    }

    const messageId = action.messageId
    const payload = action.payload

    switch(action.type) {
      case 'getEOSAccountInfoSucceeded':
        callbacks[messageId].onSuccess(payload.data)
        delete callbacks[messageId]
        break
      case 'getEOSAccountInfoFailed':
        callbacks[messageId].onError(payload.error)
        delete callbacks[messageId]
        break
      case 'parseMessageError':
        callbacks[messageId].onError(payload.error)
        delete callbacks[messageId]
        break
    }
  }

  window.bitportal = {
    getEOSAccountInfo: function({ account }) {
      return new Promise(function(resolve, reject) {
        sendRequest('getEOSAccountInfo', { account }, function(data) {
          resolve(data)
        }, function(error) {
          reject(error)
        })
      })
    }
  }

  document.dispatchEvent(new Event('bitportalLoaded'))
}
`

export default messageHandler
