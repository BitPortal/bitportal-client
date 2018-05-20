import Eos from 'eosjs'
import Keystore from 'eos/keystore'
import Keygen from 'eos/keygen'
import { EOS_API_URL } from 'constants/env'
import { encodeKeyStoreKey, decodeKey } from 'utils'
import secureStorage from 'utils/secureStorage'

const ecc = Eos.modules.ecc

const sessionConfig = {
  timeoutInMin: 30,
  uriRules: {
    owner: '.*',
    active: '.*',
    'active/**': '.*'
  }
}

let eos: any
let keystore: any

const initAccount = async ({ name, keyProvider }: { name: string, keyProvider: string | string[] }) => {
  keystore = await Keystore(name, sessionConfig)

  eos = Eos.Localnet({
    keyProvider: keyProvider || keystore.keyProvider,
    httpEndpoint: EOS_API_URL
  })

  return { eos, keystore }
}

const getKeystore = () => {
  return keystore
}

const getEOS = () => {
  return eos
}

const generateMasterKeys = async () => {
  const keys = await Keygen.generateMasterKeys()
  return keys
}

const privateToPublic = async (privateKey: string) => {
  const keys = await ecc.privateToPublic(privateKey)
  return keys
}

const deriveKeys = async (options: {}) => {
  await keystore.deriveKeys(options)
}

const getLocalAccounts = async () => {
  const storagePrefix = encodeKeyStoreKey()
  const allItems = await secureStorage.getAllItems()
  const accounts = Object.keys(allItems)
    .filter((account => account.indexOf(storagePrefix) !== -1))
    .map(account => decodeKey(account)[1])
    .filter((item, position, self) => self.indexOf(item) === position)
  return accounts
}

const isValidPrivate = (privateKey: string) => ecc.isValidPrivate(privateKey)

export default {
  getEOS,
  getKeystore,
  initAccount,
  generateMasterKeys,
  privateToPublic,
  deriveKeys,
  getLocalAccounts,
  isValidPrivate
}
