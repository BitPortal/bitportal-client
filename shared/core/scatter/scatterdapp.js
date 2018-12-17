// import ecc from 'eosjs-ecc'
// import NetworkMessage from './NetworkMessage'
import * as NetworkMessageTypes from './NetworkMessageTypes'
// import * as PairingTags from './PairingTags'
import Error from './Error'
import Network from './Network'
// import IdGenerator from './IdGenerator'
import PluginRepository from './PluginRepository'
// import { strippedHost } from './GenericTools'
import { send as _send, subscribe as _subscribe } from './bridge'

const throws = (msg) => {
  throw new Error(msg)
}

/***
 * This is just a helper to manage resolving fake-async
 * requests using browser messaging.
 */
// class DanglingResolver {
//   constructor(_id, _resolve, _reject){
//     this.id = _id
//     this.resolve = _resolve
//     this.reject = _reject
//   }
// }

// Removing properties from exposed scatterdapp object
// Pseudo privacy
// const stream = new WeakMap()
// const resolvers = new WeakMap()
const network = new WeakMap()
let publicKey = new WeakMap()
let currentVersion = new WeakMap()
let requiredVersion = new WeakMap()

const throwIfNoIdentity = () => {
  // if (!publicKey) throws('There is no identity with an account set on your Scatter instance.')
}

/***
 * Messages do not come back on the same thread.
 * To accomplish a future promise structure this method
 * catches all incoming messages and dispenses
 * them to the open promises. */
// const _subscribe = () => {
//   stream.listenWith((msg) => {
//     if (!msg || !msg.hasOwnProperty('type')) return false
//     for (let i = 0; i < resolvers.length; i++) {
//       if (resolvers[i].id === msg.resolver) {
//         if (msg.type === 'error') resolvers[i].reject(msg.payload)
//         else resolvers[i].resolve(msg.payload)
//         resolvers = resolvers.slice(i, 1)
//       }
//     }
//   })
// }

/***
 * Turns message sending between the application
 * and the content script into async promises
 * @param _type
 * @param _payload
 */
// const _send = (_type, _payload) => new Promise((resolve, reject) => {
//   // Version requirements
//   if (!!requiredVersion && requiredVersion > currentVersion){
//     const message = new NetworkMessage(NetworkMessageTypes.REQUEST_VERSION_UPDATE, {}, -1)
//     stream.send(message, PairingTags.SCATTER)
//     reject(Error.requiresUpgrade())
//     return false
//   }

//   const id = IdGenerator.numeric(24)
//   const message = new NetworkMessage(_type, _payload, id)
//   resolvers.push(new DanglingResolver(id, resolve, reject))
//   stream.send(message, PairingTags.SCATTER)
// })

const setupSigProviders = (context) => {
  PluginRepository.signatureProviders().map((sigProvider) => {
    context[sigProvider.name] = sigProvider.signatureProvider(_send, throwIfNoIdentity)
    return context[sigProvider.name]
  })
}

/***
 * Scatterdapp is the object injected into the web application that
 * allows it to interact with Scatter. Without using this the web application
 * has no access to the extension.
 */
export default class Scatterdapp {
  constructor(_options){
    currentVersion = parseFloat(_options.version)
    this.useIdentity(_options.identity)
    this.isExtension = true
    // stream = _stream
    // resolvers = []
    setupSigProviders(this)
    _subscribe()
  }

  useIdentity(identity){
    this.identity = identity
    publicKey = identity ? identity.publicKey : ''
  }

  /***
   * Suggests the set network to the user's Scatter.
   */
  suggestNetwork(network){
    if (!Network.fromJson(network).isValid()) throws('The provided network is invalid.')
    return _send(NetworkMessageTypes.REQUEST_ADD_NETWORK, {
      network: network
    })
  }

  /***
   * Gets an Identity from the user to use.
   * @param fields - You can specify required fields such as ['email', 'country', 'firstname']
   */
  getIdentity(fields = {}){
    if (!!requiredVersion && requiredVersion > currentVersion) {
      console.log('Please update the scatter')
    }

    return _send(NetworkMessageTypes.GET_OR_REQUEST_IDENTITY, {
      network: network,
      fields
    }).then(async (identity) => {
      this.useIdentity(identity)
      return identity
    })
  }

  /***
   * Authenticates the identity on scope
   * Returns a signature which can be used to self verify against the domain name
   * @returns {Promise.<T>}
   */
  async authenticate(){
    throwIfNoIdentity()

    // TODO: Verify identity matches RIDL registration

    const signature = await _send(NetworkMessageTypes.AUTHENTICATE, {
      publicKey
    }, true).catch(err => err)

    // If the `signature` is an object, it's an error message
    if (typeof signature === 'object') return signature

    return signature
    // try {
    //   if (ecc.verify(signature, strippedHost(), publicKey)) return signature
    // } catch (e) {
    //   this.identity = null
    //   publicKey = ''
    //   throws('Could not authenticate identity')
    // }
  }

  /***
   * Signs out the identity.
   * @returns {Promise.<TResult>}
   */
  forgetIdentity() {
    throwIfNoIdentity()
    return _send(NetworkMessageTypes.FORGET_IDENTITY, {}).then(() => {
      this.identity = null
      publicKey = null
      return true
    })
  }

  /***
   * Sets a version requirement. If the version is not met all
   * scatter requests will fail and notify the user of the reason.
   * @param _version
   */
  requireVersion(_version){
    requiredVersion = _version
  }

  /***
   * Requests a signature for arbitrary data.
   * @param publicKey
   * @param data - The data to be signed
   * @param whatfor
   * @param isHash - True if the data requires a hash signature
   */
  getArbitrarySignature(publicKey, data, whatfor = '', isHash = false){
    return _send(NetworkMessageTypes.REQUEST_ARBITRARY_SIGNATURE, {
      publicKey,
      data,
      whatfor,
      isHash
    }, true)
  }

  getIdentityFromPermissions(){
    if (!!requiredVersion && requiredVersion > currentVersion) {
      console.log('Please update the scatter')
    }

    return _send(NetworkMessageTypes.GET_OR_REQUEST_IDENTITY, {})
      .then(async (identity) => {
        this.useIdentity(identity)
        return identity
      })
  }

  async isInstalled(){
    return new Promise((resolve) => {
      resolve(true)
    })
  }

  disconnect(){
    return new Promise((resolve) => {
      resolve(true)
    })
  }

  isConnected(){
    return new Promise((resolve) => {
      resolve(true)
    })
  }

  isPaired(){
    return new Promise((resolve) => {
      resolve(true)
    })
  }

  getVersion(){
    return new Promise((resolve) => {
      resolve('9.3.0')
    })
  }

  connect() {
    return new Promise(resolve => resolve(true))
  }
}
