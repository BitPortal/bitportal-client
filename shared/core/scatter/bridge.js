/* global WebViewBridge */

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

const bitportal = {
  getEOSAccountInfo: function(params) {
    if (!params.account) {
      throw new Error('"account" is required')
    }

    return send('getEOSAccountInfo', params)
  },
  getEOSCurrencyBalance: function(params) {
    if (!params.account) {
      throw new Error('"account" is required')
    } else if (!params.contract) {
      throw new Error('"contract" is required')
    }

    return send('getEOSCurrencyBalance', params)
  },
  getEOSActions: function(params) {
    if (!params.offset) {
      throw new Error('"offset" is required')
    } else if (!params.account) {
      throw new Error('"account" is required')
    } else if (!params.position) {
      throw new Error('"position" is required')
    }

    return send('getEOSActions', params)
  },
  getEOSTransaction: function(params) {
    if (!params.id) {
      throw new Error('"offset" is required')
    }

    return send('getEOSTransaction', params)
  },
  transferEOSAsset: function(params) {
    if (!params.amount) {
      throw new Error('"amount" is required')
    } else if (!params.precision) {
      throw new Error('"precision" is required')
    } else if (!params.symbol) {
      throw new Error('"symbol" is required')
    } else if (!params.contract) {
      throw new Error('"contract" is required')
    } else if (!params.from) {
      throw new Error('"from" is required')
    } else if (!params.to) {
      throw new Error('"to" is required')
    }

    return send('transferEOSAsset', params)
  },
  voteEOSProducers: function(params) {
    if (!params.voter) {
      throw new Error('"voter" is required')
    } else if (!params.producers) {
      throw new Error('"producers" is required')
    }

    return send('voteEOSProducers', params)
  },
  pushEOSAction: function(params) {
    if (!params.actions) {
      throw new Error('"actions" is required')
    }

    return send('pushEOSAction', params)
  },
  eosAuthSign: function(params) {
    if (!params.account) {
      throw new Error('"account" is required')
    } else if (!params.publicKey) {
      throw new Error('"publicKey" is required')
    } else if (!params.signData) {
      throw new Error('"signData" is required')
    }

    return send('eosAuthSign', params)
  },
  getCurrentWallet: function() {
    return send('getCurrentWallet')
  },
  getAppInfo: function() {
    return send('getAppInfo')
  }
}

export default bitportal
