import assert from 'assert'
import nacl from 'tweetnacl'
import { isReady, ed25519Verify, ed25519KeypairFromSeed, ed25519Sign } from '@polkadot/util-crypto'
import randomBytes from '../randomBytes'

export const encrypt = async (message, secret, nonce) => {
  nonce = nonce || (await randomBytes(24))

  return {
    encrypted: nacl.secretbox(message, nonce, secret),
    nonce
  }
}

export const decrypt = async (encrypted, nonce, secret) => nacl.secretbox.open(encrypted, nonce, secret) || null

export const sign = async (message, { publicKey, secretKey }) => {
  assert(secretKey, 'Expected valid secretKey')

  return isReady() ? ed25519Sign(publicKey, secretKey.subarray(0, 32), message) : nacl.sign.detached(message, secretKey)
}

export const verify = async (message, signature, publicKey) => isReady() ? ed25519Verify(signature, message, publicKey) : nacl.sign.detached.verify(message, signature, publicKey)

export const keypairFromRandom = async () => nacl.sign.keyPair()

export const keypairFromSecret = async secret => nacl.sign.keyPair.fromSecretKey(secret)

export const keypairFromSeed = async (seed) => {
  if (isReady()) {
    const full = ed25519KeypairFromSeed(seed)

    return {
      publicKey: full.slice(32),
      secretKey: full.slice(0, 64)
    }
  }

  return nacl.sign.keyPair.fromSeed(seed)
}

export default { encrypt, decrypt, sign, verify, keypairFromRandom, keypairFromSecret, keypairFromSeed }
