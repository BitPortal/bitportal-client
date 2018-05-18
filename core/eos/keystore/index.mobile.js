import assert from 'assert'
import ecc, { PrivateKey, Signature } from 'react-native-eosjs-ecc'
import minimatch from 'minimatch'
import Keygen from '../keygen'
import UriRules from '../uriRules'
import validate from '../validate'
import globalConfig from '../config'
import Storage from '../keypathUtils'

const localStorage = globalConfig.localStorage
const userStorage = Storage('kstor')

/**
  Provides private key management and storage and tooling to limit exposure
  of private keys as much as possible.
  Although multiple root keys may be stored, this key store was designed with
  the idea that all keys for a given `accountName` are derive from a single
  root key (the master private key).
  This keystore does not query the blockchain or any external services.
  Removing keys here does not affect the blockchain.
  @arg {string} accountName - Blockchain account name that will act as the
  container for a key and all derived child keys.
  @arg {object} [config]
  @arg {number} [config.timeoutInMin = 10] - upon timeout, remove keys
  matching timeoutKeyPaths.
  @arg {number} [config.timeoutKeyPaths = ['owner', 'owner/**']] - by default,
  expire only owner and owner derived children.  If the default uriRules are
  used this actually has nothing to delete.
  @arg {uriRules} [config.uriRules] - Specify which type of private key will
  be available on certain pages of the application.  Lock it down as much as
  possible and later re-prompt the user if a key is needed.  Default is to
  allow active (`active`) and all active derived keys (`active/**`) everywhere
  (`.*`).
  @arg {boolean} [keepPublicKeys = true] - Enable for better UX; show users keys they
  have access too without requiring them to login. Logging in brings a
  private key online which is not necessary to see public information.
  The UX should implement this behavior in a way that is clear public keys
  are cached before enabling this feature.
  @example config = {
  uriRules: {
    'active': '.*',
    'active/**': '.*'
  },
  timeoutInMin: 10,
  timeoutKeyPaths: [
    'owner',
    'owner/**'
  ],
  keepPublicKeys: true
}
*/
async function Keystore(accountName, config = {}) {
  assert.equal(typeof accountName, 'string', 'accountName')
  assert.equal(typeof config, 'object', 'config')

  const configDefaults = {
    uriRules: {
      'active': '.*',
      'active/**': '.*'
    },
    timeoutInMin: 10,
    timeoutKeyPaths: [
      'owner',
      'owner/**'
    ],
    keepPublicKeys: true
  }

  config = { ...configDefaults, ...config }

  const uriRules = UriRules(config.uriRules)

  /** @private */
  const state = {}

  let expireAt, expireInterval
  let unlistenHistory

  // Initialize state from localStorage
  await userStorage.queryAsync(localStorage, [accountName, 'kpath'], ([path, pubkey], wif) => {
    const storageKey = userStorage.createKey(accountName, 'kpath', path, pubkey)
    state[storageKey] = wif
  })

  /**
    Login or derive and save private keys.  This may be called from a login
    action.  Keys may be removed as during Uri navigation or when calling
    logout.
    @arg {object} params
    @arg {parentPrivateKey} params.parent - Master password (masterPrivateKey),
    active, owner, or other permission key.
    @arg {Array<keyPathMatcher>} [params.saveKeyMatches] - These private
    keys will be saved to disk. (example: `active`).
    @arg {accountPermissions} [params.accountPermissions] - Permissions object
    from Eos blockchain via get_account.  This is used to validate the parent
    and derive additional permission keys.  This allows this keystore to detect
    incorrect passwords early before trying to sign a transaction.
    See Chain API `get_account => account.permissions`.
    @throws {Error} 'invalid login'
  */
  async function deriveKeys({
    parent,
    saveKeyMatches = [],
    accountPermissions
  }) {
    keepAlive()

    assert(parent != null, 'parent is a master password or private key')

    const keyType = validate.keyType(parent)
    assert(/master|wif|privateKey/.test(keyType),
      'parentPrivateKey is a masterPrivateKey or private key')

    if(typeof saveKeyMatches === 'string') {
      saveKeyMatches = [saveKeyMatches]
    }

    saveKeyMatches.forEach(m => {
      if(minimatch('owner', m)) {
        throw new Error('do not save owner key to disk')
      }
      // if(minimatch('active', m)) {
      //   throw new Error('do not save active key to disk')
      // }
    })

    assert(typeof accountPermissions === 'object' || accountPermissions == null,
      'accountPermissions is an optional object')

    if(!unlistenHistory) {
      unlistenHistory = globalConfig.history.listen(() => {
        keepAlive()

        // Prevent certain private keys from being available to high-risk pages.
        const paths = getKeyPaths().wif
        const pathsToPurge = uriRules.check(currentUriPath(), paths).deny
        removeKeys(pathsToPurge)
      })
    }

    if(!expireInterval) {
      if(config.timeoutInMin != null) {
        function tick() {
          if(timeUntilExpire() === 0) {
            removeKeys(config.timeoutKeyPaths)
            clearInterval(expireInterval)
            expireInterval = null
          }
        }

        expireInterval = setInterval(tick, config.timeoutInMin * min)
      }
    }

    // cache
    if(!accountPermissions) {
      const permissions =
        await userStorage.get(localStorage, [accountName, 'permissions'])

      if(permissions) {
        accountPermissions = JSON.parse(permissions)
      }
    }

    // cache pubkey (that is a slow calculation)
    const Keypair = privateKey => ({
      privateKey,
      pubkey: privateKey.toPublic().toString()
    })

    // blockchain permission format
    const perm = (parent, perm_name, pubkey) => ({
      perm_name, parent, required_auth: { keys: [{ key: pubkey }] }
    })

    // Know if this is stubbed in next (don't cache later)
    const isPermissionStub = accountPermissions == null

    const parentKeys = {}
    if(keyType === 'master') {
      const masterPrivateKey = PrivateKey(parent.substring(2))
      parentKeys.owner = Keypair(masterPrivateKey.getChildKey('owner'))
      parentKeys.active = Keypair(parentKeys.owner.privateKey.getChildKey('active'))
      if(!accountPermissions) {
        accountPermissions = [
          perm('owner', 'active', parentKeys.active.pubkey),
          perm('', 'owner', parentKeys.owner.pubkey)
        ]
      }
    } else {
      if(accountPermissions) {
        // unknown for now..
        parentKeys.other = Keypair(PrivateKey(parent))
      } else {
        parentKeys.active = Keypair(PrivateKey(parent))
        accountPermissions = [
          perm('owner', 'active', parentKeys.active.pubkey)
        ]
      }
    }

    assert(accountPermissions, 'accountPermissions is required at this point')

    const authsByPath = Keygen.authsByPath(accountPermissions)

    // Don't allow key re-use
    function uniqueKeyByRole(role) {
      const auth = authsByPath[role]
      if(auth == null) {
        return
      }
      auth.keys.forEach(rolePub => {
        for(const other in authsByPath) {
          if(other === role) {
            continue
          }
          authsByPath[other].keys.forEach(otherPub => {
            if(otherPub.key === rolePub.key) {
              throw new Error(role + ' key reused in authority: ' + other)
            }
          })
        }
      })
    }
    // uniqueKeyByRole('active')
    // uniqueKeyByRole('owner')

    if(!isPermissionStub) {
      // cache
      await userStorage.saveAsync(
        localStorage,
        [accountName, 'permissions'],
        JSON.stringify(accountPermissions),
        {immutable: false}
      )
    }

    let keyUpdates = [], allow = false

    // check existing keys..
    for(const path in authsByPath) {
      const auth = authsByPath[path]
      for(const parentPath in parentKeys) {
        const parentKey = parentKeys[parentPath] // owner, active, other
        if(auth.keys.find(k => k.key === parentKey.pubkey) != null) {
          keyUpdates.push({ path, privateKey: parentKey.privateKey })
        }
      }
    }


    if(keyUpdates.length === 0) {
      throw new Error('invalid login')
    }

    // Sync keyUpdates with storage ..
    async function saveKeyUpdates() {
      // sort key updates so removeKeys will only remove children
      for(const { path, privateKey } of keyUpdates.sort()) {
        const disk = saveKeyMatches.find(m => minimatch(path, m)) != null
        const update = addKey(path, privateKey, disk)
        if (update) {
          allow = true
          if(update.dirty) { // blockchain key changed
            // remove so these will be re-derived
            const keys = await getKeys(`${path}/**`)
            const children = keys.map(k => k.path)
            removeKeys(children, false/*keepPublicKeys*/)
          }
        }
      }
    }

    await saveKeyUpdates()

    // Gather up all known keys then derive children
    const wifsByPath = {}

    // After saveKeyUpdates, fetch the remaining allowed and valid private keys
    const keys = await getKeys()
    keys.filter(k => !!k.wif).forEach(k => {
      // getKeys => {path, pubkey, wif}
      wifsByPath[k.path] = k.wif
    })

    // Combine existing keys in the keystore with any higher permission keys
    // in wifsByPath that may not exist after this function call.
    for(const { path, privateKey } of keyUpdates) {
      if(!wifsByPath[path]) {
        // These more secure keys could be used to derive less secure
        // child keys below.
        wifsByPath[path] = privateKey.toWif()
      }
    }

    keyUpdates = []

    // Use all known keys in wifsByPath to derive all known children.

    // Why?  As the user navigates any parent could get removed but the child
    // could still be allowed.  Good thing we saved the children while we could.
    for(const path in authsByPath) {
      if(!wifsByPath[path]) {
        const keys = Keygen.deriveKeys(path, wifsByPath)
        if(keys.length) {
          const authorizedKeys = authsByPath[path].keys.map(k => k.key)
          for (const key of keys) { // {path, privateKey}
            const pubkey = key.privateKey.toPublic().toString()
            const inAuth = !!authorizedKeys.find(k => k === pubkey)
            if (inAuth) { // if user did not change this key
              wifsByPath[key.path] = key.privateKey.toWif()
              keyUpdates.push(key)
            }
          }
        }
      }
    }

    // save allowed children
    await saveKeyUpdates()
    keyUpdates = []

    if(!allow) {
      // uri rules blocked every key
      throw new Error('invalid login for page')
    }
  }

  /**
    @private see: keystore.deriveKeys
    Save a private or public key to the store in either RAM only or RAM and
    disk.  Typically deriveKeys is used instead.
    @arg {keyPath} path - active/mypermission, owner, active, ..
    @arg {string} key - wif, pubkey, or privateKey
    @arg {boolean} toDisk - save to persistent storage (localStorage)
    @throws {AssertionError} path error or active, owner/* toDisk save attempted
    @return {object} {[wif], pubkey, dirty} or null (denied by uriRules)
  */
  async function addKey(path, key, toDisk = false) {
    validate.path(path)
    keepAlive()

    const keyType = validate.keyType(key)
    assert(/^wif|pubkey|privateKey$/.test(keyType),
      'key should be a wif, public key string, or privateKey object')

    if(toDisk) {
      assert(path !== 'owner', 'owner key should not be stored on disk')
      assert(path.indexOf('owner/') !== 0, 'owner derived keys should not be stored on disk')

      // assert(path !== 'active', 'active key should not be stored on disk')
    }

    if(uriRules.deny(currentUriPath(), path).length) {
      // console.log('Keystore addKey denied: ', currentUriPath(), path);
      return null
    }

    const wif =
      keyType === 'wif' ? key :
      keyType === 'privateKey' ? ecc.PrivateKey(key).toWif() :
      null

    const pubkey =
      keyType === 'pubkey' ? ecc.PublicKey(key).toString() :
      keyType === 'privateKey' ? key.toPublic().toString() :
      ecc.privateToPublic(wif)

    assert(!!pubkey, 'pubkey')

    const storageKey = userStorage.createKey(accountName, 'kpath', path, pubkey)

    let dirty = userStorage.save(state, storageKey, wif, { clobber: false })

    if(toDisk) {
      const saved = await userStorage.saveAsync(localStorage, storageKey, wif, { clobber: false })
      dirty = dirty || saved
    }

    return wif == null ? { pubkey, dirty } : { wif, pubkey, dirty }
  }

  /**
    Return paths for all available keys.  Empty array is used if there are
    no keys.
    @return {object} {pubkey: Array<pubkey>, wif: Array<wif>}
  */
  async function getKeyPaths() {
    keepAlive()

    const pubs = new Set()
    const wifs = new Set()

    function query(store) {
      userStorage.query(store, [accountName, 'kpath'], ([path, pubkey], wif) => {
        pubs.add(path)
        if(wif != null) {
          wifs.add(path)
        }
      })
    }

    async function queryAsync(store) {
      await userStorage.query(store, [accountName, 'kpath'], ([path, pubkey], wif) => {
        pubs.add(path)
        if(wif != null) {
          wifs.add(path)
        }
      })
    }

    query(state)
    await queryAsync(localStorage)

    return { pubkey: Array.from(pubs).sort(), wif: Array.from(wifs).sort() }
  }

  /**
    Fetch or derive a public key.
    @arg {keyPath}
    @return {pubkey} or null
  */
  async function getPublicKey(path) {
    validate.path(path)
    const [key] = await getKeys(path)
    return key ? key.pubkey : null
  }

  /**
    Return public keys for a path or path matcher.
    @arg {keyPath|keyPathMatcher} [keyPathMatcher = '**'] return all keys
    @return {Array<pubkey>} public keys or empty array
  */
  async function getPublicKeys(keyPathMatcher = '**') {
    const keys = await getKeys(keyPathMatcher)
    return keys.map(key => key.pubkey)
  }

  /**
    Fetch or derive a private key.
    @arg {keyPath} path
    @return {wif} or null (missing or not available for location)
  */
  async function getPrivateKey(path) {
    validate.path(path)
    const [key] = await getKeys(path)
    return key ? key.wif : undefined
  }

  /**
    Return private keys for a path matcher or for a list of public keys.  If a
    list of public keys is provided they will be validated ensuring they all
    have private keys to return.
    @arg {keyPathMatcher} [keyPathMatcher = '**'] default is to match all
    @arg {Array<pubkey>} [pubkeys = null] if specified, filter and require all
    @throws Error `login with your ${key.pubkey} key`
    @throws Error `missing public key ${key}`
    @return {Array<wif>} wifs or empty array
  */
  async function getPrivateKeys(keyPathMatcher = '**', pubkeys) {
    if (!pubkeys) {
      const keys = await getKeys(keyPathMatcher)
      return keys
        .filter(key => key.wif != null)
        .map(key => key.wif)
    }

    if (pubkeys instanceof Array) {
      pubkeys = new Set(pubkeys)
    }

    assert(pubkeys instanceof Set, 'pubkeys should be a Set or Array')

    const keys = new Map()

    const keysMatched = await getKeys(keyPathMatcher)
    keysMatched.filter(key => pubkeys.has(key.pubkey)).forEach(key => {
      if(key.wif == null) {
        throw new Error(`login with your '${key.path}' key`)
      }
      keys.set(key.pubkey, key.wif)
    })

    pubkeys.forEach(key => {
      if(!keys.has(key)) {
        // Was keepPublicKeys true?
        throw new Error(`missing public key ${key}`)
      }
    })

    return Array.from(keys.values())
  }

  /**
    Fetch or derive a key pairs.
    @arg {keyPath|keyPathMatcher} keyPathMatcher
    @return {Array<keyPathPrivate>} {path, pubkey, deny, wif} or empty array.
    Based on the Uri rules and current location, the deny could be set to true
    and the wif will be null.
  */
  async function getKeys(keyPathMatcher = '**') {
    keepAlive()

    const keys = new Map()

    // if we try to derive it below
    const wifsByPath = {}

    const isPath = validate.isPath(keyPathMatcher)

    function query(store) {
      userStorage.query(store, [accountName, 'kpath'], ([path, pubkey], wif) => {
        if(wif == null) {
          wif = wifsByPath[path]
        } else {
          wifsByPath[path] = wif
        }
        if(minimatch(path, keyPathMatcher)) {
          const result = {path, pubkey}
          result.deny = uriRules.deny(currentUriPath(), path).length !== 0
          result.wif = result.deny ? null : wif
          keys.set(path, result)
          if (isPath) {
            return false // break
          }
        }
      })
    }

    async function queryAsync(store) {
      await userStorage.query(store, [accountName, 'kpath'], ([path, pubkey], wif) => {
        if(wif == null) {
          wif = wifsByPath[path]
        } else {
          wifsByPath[path] = wif
        }
        if(minimatch(path, keyPathMatcher)) {
          const result = { path, pubkey }
          result.deny = uriRules.deny(currentUriPath(), path).length !== 0
          result.wif = result.deny ? null : wif
          keys.set(path, result)
          if(isPath) {
            return false // break
          }
        }
      })
    }

    await query(state)
    if(isPath && keys.size) {
      // A path can match only one, found so no need to query localStorage
      return Array.from(keys.values())
    }

    await queryAsync(localStorage)
    if(!isPath) {
      // keyPathMatcher can not derive keys
      // .. the search is complete (found or not)
      return Array.from(keys.values())
    }

    assert(isPath, 'keyPathMatcher should be a path at this point')

    let key = null

    // derive children (path)
    const path = keyPathMatcher
    const deriveKeys = Keygen.deriveKeys(path, wifsByPath)
    if(deriveKeys.length) {
      for(const derivedKey of deriveKeys) { // {path, privateKey}
        if(derivedKey.path === path) {// filter intermediate children
          const deny = uriRules.deny(currentUriPath(), path).length !== 0
          key = {
            path,
            pubkey: derivedKey.privateKey.toPublic().toString(),
            wif: deny ? null : derivedKey.privateKey.toWif(),
            deny
          }
          break
        }
      }
    }

    return key ? [key] : []
  }

  /**
    @private Remove a key or keys from this key store (ram and disk).  Typically
    logout is used instead.
    @arg {keyPathMatcher|Array<keyPathMatcher>|Set<keyPathMatcher>}
    @arg {boolean} keepPublicKeys
  */
  async function removeKeys(paths, keepPublicKeys = config.keepPublicKeys) {
    assert(paths != null, 'paths')
    if(typeof paths === 'string') {
      paths = [paths]
    }
    assert(paths instanceof Array || paths instanceof Set, 'paths is a Set or Array')
    for(const path of paths) {
      validate.path(path)
    }

    function clean(store, prefix) {
      for(const key in store) {
        if(key.indexOf(prefix) === 0) {
          if(keepPublicKeys) {
            store[key] = null
          } else {
            delete store[key]
          }
        }
      }
    }

    async function cleanAsync(store, prefix) {
      const allItems = store.getAllItems()
      for(const key in allItems) {
        if(key.indexOf(prefix) === 0) {
          if(keepPublicKeys) {
            await store.setItem(key, null)
          } else {
            await store.removeItem(key)
          }
        }
      }
    }

    for(const path of paths) {
      const prefix = userStorage.createKey(accountName, 'kpath', path)
      clean(state, prefix)
      await cleanAsync(localStorage, prefix)
    }
  }

  /**
    @typedef {object} oneTimeSignatures
    @property {Array<string>} signatures - in hex
    @property {pubkey} oneTimePublic
  */
  /**
    @arg {pubkey} otherPubkey
    @arg {keyPathMatcher} keyPathMatcher
    @return {Promise<oneTimeSignatures>}
  */
  function signSharedSecret(otherPubkey, keyPathMatcher = '**') {
    assert(/pubkey|PublicKey/.test(validate.keyType(otherPubkey)), 'otherPubkey')
    assert(typeof keyPathMatcher, 'string', 'keyPathMatcher')

    return PrivateKey.randomKey().then(oneTimePrivate => {
      const sharedSecret = oneTimePrivate.getSharedSecret(otherPubkey)
      const signatures = getPrivateKeys(keyPathMatcher).map(wif =>
        ecc.sign(sharedSecret, wif)
      )
      const oneTimePublic = ecc.privateToPublic(oneTimePrivate)
      return {
        signatures,
        oneTimePublic
      }
    })
  }

  /**
    Removes all saved keys on disk and clears keys in memory.  Call only when
    the user chooses "logout."  Do not call when the application exits.
    Forgets everything allowing the user to use a new password next time.
  */
  async function logout() {
    for(const key in state) {
      delete state[key]
    }

    const prefix = userStorage.createKey(accountName)
    const allItems = await localStorage.getAllItems()
    for(const key in allItems) {
      if(key.indexOf(prefix) === 0) {
        await localStorage.removeItem(key)
      }
    }

    clearInterval(expireInterval)
    expireInterval = null

    if(unlistenHistory) {
      unlistenHistory()
      unlistenHistory = null
    }

    expireAt = null
  }

  /**
    @return {number} 0 (expired) or milliseconds until expire
  */
  function timeUntilExpire() {
    return (
      expireAt === 0 ? 0 :
      expireAt == null ? 0 :
      Math.max(0, expireAt - Date.now())
    )
  }

  /**
    Keep alive (prevent expiration).  Called automatically if Uri navigation
    happens or keys are required.  It may be necessary to call this manually.
  */
  function keepAlive() {
    expireAt = Date.now() + config.timeoutInMin * min
  }

  /**
    Integration for 'eosjs' ..
    Call keyProvider with no parameters or with a specific keyPathMatcher
    pattern to get an array of public keys in this key store.  A library
    like eosjs may be provided these available public keys to eosd
    get_required_keys for filtering and to determine which private keys are
    needed to sign a given transaction.
    Call again with the get_required_keys pubkeys array to get the required
    private keys returned (or an error if any are missing).
    @throws Error `login with your ${path} key`
    @throws Error `missing public key ${key}`
    @arg {object} param
    @arg {string} [param.keyPathMatcher = '**'] - param.keyPathMatcher for public keys
    @arg {Array<pubkey>|Set<pubkey>} [param.pubkeys] for fetching private keys
    @return {Array<pubkey|wif>} available pubkeys in the keystore or matching
    wif private keys for the provided pubkeys argument (also filtered using
    keyPathMatcher).
    @see https://github.com/eosio/eosjs
  */
  function keyProvider({ keyPathMatcher = '**', pubkeys } = {}) {
    keepAlive()

    if(pubkeys) {
      return getPrivateKeys(keyPathMatcher, pubkeys)
    }

    if(keyPathMatcher) {
      // For `login with your xxx key` below, get all keys even if a
      // wif is not available.
      return getPublicKeys(keyPathMatcher)
    }
  }

  return {
    deriveKeys,
    addKey,
    getKeys,
    getKeyPaths,
    getPublicKey,
    getPublicKeys,
    getPrivateKey,
    getPrivateKeys,
    removeKeys,
    signSharedSecret,
    logout,
    timeUntilExpire,
    keepAlive,
    keyProvider
  }
}

/** @private */
function currentUriPath() {
  const { location } = globalConfig.history
  return `${location.pathname}${location.search}${location.hash}`
}

/** Erase all traces of this keystore (for all users). */
Keystore.wipeAll = async function() {
  const prefix = userStorage.createKey()
  const allItems = await localStorage.getAllItems()
  for(const key in allItems) {
    if(key.indexOf(prefix) === 0) {
      await localStorage.removeItem(key)
    }
  }
}

// used to convert milliseconds
const sec = 1000, min = 60 * sec

export default Keystore
