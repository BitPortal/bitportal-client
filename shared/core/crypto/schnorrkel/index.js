import assert from 'assert'
import { sr25519Sign, sr25519Verify, sr25519KeypairFromSeed } from '@polkadot/util-crypto'

const SEC_LEN = 64
const PUB_LEN = 32

export const sign = async (message, { publicKey, secretKey }) => {
  assert(publicKey && publicKey.length === 32, 'Expected valid publicKey, 32-bytes')
  assert(secretKey && secretKey.length === 64, 'Expected valid secretKey, 64-bytes')

  return sr25519Sign(publicKey, secretKey, message)
}

export const verify = async (message, signature, publicKey) => {
  return sr25519Verify(signature, message, publicKey)
}

export const keypairFromU8a = async (full) => {
  return {
    publicKey: full.slice(SEC_LEN, SEC_LEN + PUB_LEN),
    secretKey: full.slice(0, SEC_LEN)
  }
}

export const schnorrkelKeypairFromSeed = async (seed) => {
  return keypairFromU8a(
    sr25519KeypairFromSeed(seed)
  )
}

export default { sign, verify, schnorrkelKeypairFromSeed }
