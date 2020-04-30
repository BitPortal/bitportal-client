/*global Web3*/
cleanContextForImports()
require('./web3/web3.min.js')
const _subscribe = require('./bridge').subscribe
const LocalMessageDuplexStream = require('./post-message-stream')
const setupDappAutoReload = require('./auto-reload.js')
const MetamaskInpageProvider = require('./metamask-inpage-provider')
const createStandardProvider = require('./createStandardProvider').default

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
var event = new Event('WebViewBridge')
window.dispatchEvent(event)

let warned = false

restoreContextAfterImports()
//
// setup plugin communication
//
_subscribe()

// setup background connection
const metamaskStream = new LocalMessageDuplexStream({
  name: 'inpage',
  target: 'contentscript',
})

// compose the inpage provider
const inpageProvider = new MetamaskInpageProvider(metamaskStream)

// set a high max listener count to avoid unnecesary warnings
inpageProvider.setMaxListeners(100)

// augment the provider with its enable method
inpageProvider.enable = function ({ force } = {}) {
  return new Promise((resolve, reject) => {
    inpageProvider.sendAsync({ method: 'eth_requestAccounts', params: [force] }, (error, response) => {
      if (error) {
        reject(error)
      } else {
        if (response.error) {
          reject(response.error)
        } else {
          inpageProvider.publicConfigStore.updateState({ selectedAddress: response.result[0], networkVersion: '1' })
          resolve(response.result)
        }
      }
    })
  })
}

// give the dapps control of a refresh they can toggle this off on the window.ethereum
// this will be default true so it does not break any old apps.

// add metamask-specific convenience methods
inpageProvider.autoRefreshOnNetworkChange = true
inpageProvider._metamask = new Proxy({
  /**
   * Synchronously determines if this domain is currently enabled, with a potential false negative if called to soon
   *
   * @returns {boolean} - returns true if this domain is currently enabled
   */
  isEnabled: function () {
    const { isEnabled } = inpageProvider.publicConfigStore.getState()
    return Boolean(isEnabled)
  },

  /**
   * Asynchronously determines if this domain is currently enabled
   *
   * @returns {Promise<boolean>} - Promise resolving to true if this domain is currently enabled
   */
  isApproved: async function () {
    const { isEnabled } = await getPublicConfigWhenReady()
    return Boolean(isEnabled)
  },

  /**
   * Determines if MetaMask is unlocked by the user
   *
   * @returns {Promise<boolean>} - Promise resolving to true if MetaMask is currently unlocked
   */
  isUnlocked: async function () {
    const { isUnlocked } = await getPublicConfigWhenReady()
    return Boolean(isUnlocked)
  },
}, {
  get: function (obj, prop) {
    !warned && console.warn('Heads up! ethereum._metamask exposes methods that have ' +
    'not been standardized yet. This means that these methods may not be implemented ' +
    'in other dapp browsers and may be removed from MetaMask in the future.')
    warned = true
    return obj[prop]
  },
})

// publicConfig isn't populated until we get a message from background.
// Using this getter will ensure the state is available
async function getPublicConfigWhenReady () {
  const store = inpageProvider.publicConfigStore
  let state = store.getState()
  // if state is missing, wait for first update
  if (!state.networkVersion) {
    state = await new Promise(resolve => store.once('update', resolve))
    console.log('new state', state)
  }
  return state
}

// Work around for web3@1.0 deleting the bound `sendAsync` but not the unbound
// `sendAsync` method on the prototype, causing `this` reference issues with drizzle
const proxiedInpageProvider = new Proxy(inpageProvider, {
  // straight up lie that we deleted the property so that it doesnt
  // throw an error in strict mode
  deleteProperty: () => true,
})

window.ethereum = createStandardProvider(proxiedInpageProvider)

//
// setup web3
//

if (typeof window.web3 !== 'undefined') {
  throw new Error(`MetaMask detected another web3.
     MetaMask will not work reliably with another web3 extension.
     This usually happens if you have two MetaMasks installed,
     or MetaMask and another web3 extension. Please remove one
     and try again.`)
}

const web3 = new Web3(proxiedInpageProvider)
web3.setProvider = function () {
  console.log('MetaMask - overrode web3.setProvider')
}
console.log('MetaMask - injected web3', web3)

setupDappAutoReload(web3, inpageProvider.publicConfigStore)

// export global web3, with usage-detection and deprecation warning

/* TODO: Uncomment this area once auto-reload.js has been deprecated:
let hasBeenWarned = false
global.web3 = new Proxy(web3, {
  get: (_web3, key) => {
    // show warning once on web3 access
    if (!hasBeenWarned && key !== 'currentProvider') {
      console.warn('MetaMask: web3 will be deprecated in the near future in favor of the ethereumProvider \nhttps://github.com/MetaMask/faq/blob/master/detecting_metamask.md#web3-deprecation')
      hasBeenWarned = true
    }
    // return value normally
    return _web3[key]
  },
  set: (_web3, key, value) => {
    // set value normally
    _web3[key] = value
  },
})
*/

// set web3 defaultAccount
inpageProvider.publicConfigStore.subscribe(function (state) {
  web3.eth.defaultAccount = state.selectedAddress
})

inpageProvider.publicConfigStore.subscribe(function (state) {
  if (state.onboardingcomplete) {
    window.postMessage('onboardingcomplete', '*')
  }
})

// need to make sure we aren't affected by overlapping namespaces
// and that we dont affect the app with our namespace
// mostly a fix for web3's BigNumber if AMD's "define" is defined...
let __define

/**
 * Caches reference to global define object and deletes it to
 * avoid conflicts with other global define objects, such as
 * AMD's define function
 */
function cleanContextForImports () {
  __define = global.define
  try {
    global.define = undefined
  } catch (_) {
    console.warn('MetaMask - global.define could not be deleted.')
  }
}

/**
 * Restores global define object from cached reference
 */
function restoreContextAfterImports () {
  try {
    global.define = __define
  } catch (_) {
    console.warn('MetaMask - global.define could not be overwritten.')
  }
}
