import assert from 'assert'
import { PrivateKey, PublicKey } from 'eosjs-ecc'

function isMasterKey(key) {
  return /^PW/.test(key) && PrivateKey.isWif(key.substring(2))
}

function keyType(key) {
  if (isMasterKey(key)) return 'master'
  if (PrivateKey.isWif(key)) return 'wif'
  if (PrivateKey.isValid(key)) return 'privateKey'
  if (PublicKey.isValid(key)) return 'pubkey'
  return null
}

/**
   Static validation of a keyPath.  Protect against common mistakes.
   @see [validate.test.js](./validate.test.js)
   @arg {keyPath} path
   @example path('owner')
   @example path('active')
   @example path('active/mypermission')
*/
function path(path) {
  assert.equal(typeof path, 'string', 'path')
  assert(path !== '', 'path should not be empty')
  assert(path.indexOf(' ') === -1, 'remove spaces')
  assert(path.indexOf('\\') === -1, 'use forward slash')
  assert(path[0] !== '/', 'remove leading slash')
  assert(path[path.length - 1] !== '/', 'remove ending slash')
  assert(!/[A-Z]/.test(path), 'path should not have uppercase letters')
  assert(path !== 'owner/active', 'owner is implied, juse use active')
  const el = Array.from(path.split('/'))
  const unique = new Set()
  el.forEach(e => unique.add(e))
  assert(unique.size === el.length, 'duplicate path element')
  assert(el[0] === 'owner' || el[0] === 'active', 'path should start with owner or active')
  assert(!el.includes('owner') || el.indexOf('owner') === 0, 'owner is always first')
  assert(!el.includes('active') || el.indexOf('active') === 0, 'active is always first')
}

function isPath(txt) {
  try {
    path(txt)
    return true
  } catch (e) {
    return false
  }
}

export default {
  isMasterKey,
  keyType,
  isPath,
  path
}
