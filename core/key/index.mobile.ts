import assert from 'assert'
import * as bip32 from 'bip32'
import * as bip44 from 'bip44'
import bip39 from 'react-native-bip39'
import wif from 'wif'
import { createHash, createHmac } from 'crypto'
import secp256k1 from 'secp256k1'
import base58 from 'bs58'
import { isValidPrivate, privateToPublic } from 'eos'

export const getIdFromSeed = (seed: string) => {
  const MASTER_SALT = Buffer.from('Bitportal id', 'utf8')
  const privateKey = createHmac('sha256', MASTER_SALT).update(new Buffer(seed, 'hex')).digest()
  assert(secp256k1.privateKeyVerify(privateKey), 'Invalid private key!')
  const publicKey = secp256k1.publicKeyCreate(privateKey)
  const check = [publicKey]
  const checksum = createHash('rmd160').update(Buffer.concat(check)).digest().slice(0, 4)
  const address = base58.encode(Buffer.concat([publicKey, checksum]))
  const id = 'BP' + address
  return id
}

export const getMasterSeed = async (mnemonicPhrase: string) => {
  let phrase

  if (mnemonicPhrase) {
    phrase = mnemonicPhrase
  } else {
    phrase = await bip39.generateMnemonic()
  }

  assert(bip39.validateMnemonic(phrase), 'Invalid mnemonic phrase!')
  const seed = bip39.mnemonicToSeedHex(phrase)
  const id = getIdFromSeed(seed)

  return { phrase, seed, id }
}

export const getEOSKeys = async (seed) => {
  const root = bip32.fromMasterSeed(new Buffer(seed, 'hex'))
  const path = bip44.getBIP44Path({ symbol: 'EOS' })

  const eosPrivateKey = root.derive(path).privateKey
  const eosWIF = wif.encode(0x80, eosPrivateKey, false)
  assert(isValidPrivate(eosWIF), 'Invalid eos master wif!')
  const eosMasterWIF = 'PW' + eosWIF

  const eosOwnerPrivateKey = createHash('sha256').update(eosPrivateKey).update('owner').digest()
  const eosOwnerWIF = wif.encode(0x80, eosOwnerPrivateKey, false)
  assert(isValidPrivate(eosOwnerWIF), 'Invalid eos owner wif!')
  const eosOwnerPublicKey = await privateToPublic(eosOwnerPrivateKey)

  const eosActivePrivateKey = createHash('sha256').update(eosOwnerPrivateKey).update('active').digest()
  const eosActiveWIF = wif.encode(0x80, eosActivePrivateKey, false)
  assert(isValidPrivate(eosActiveWIF), 'Invalid eos active wif!')
  const eosActivePublicKey = await privateToPublic(eosActivePrivateKey)

  return {
    coin: 'EOS',
    keys: {
      master: {
        private: {
          origin: eosPrivateKey.toString('hex'),
          wif: eosMasterWIF
        }
      },
      owner: {
        private: {
          origin: eosOwnerPrivateKey.toString('hex'),
          wif: eosOwnerWIF
        },
        public: eosOwnerPublicKey
      },
      active: {
        private: {
          origin: eosActivePrivateKey.toString('hex'),
          wif: eosActiveWIF
        },
        public: eosActivePublicKey
      }
    }
  }
}
