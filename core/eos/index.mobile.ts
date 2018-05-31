import Eos from 'react-native-eosjs'
import { ENV, EOS_API_URL } from 'constants/env'

const ecc = Eos.modules.ecc
let eos: any

const initAccount = async ({ keyProvider, signProvider }: { keyProvider: string | string[], signProvider: any }) => {
  eos = Eos.Localnet({
    httpEndpoint: EOS_API_URL,
    keyProvider,
    signProvider
  })

  return { eos }
}

const getEOS = () => {
  return eos
}

const randomKey = async () => {
  const privateKey = await ecc.randomKey()
  return privateKey
}

const privateToPublic = async (privateKey: string) => {
  const keys = await ecc.privateToPublic(privateKey)
  return keys
}

const isValidPrivate = (privateKey: string) => ecc.isValidPrivate(privateKey)

export {
  getEOS,
  initAccount,
  privateToPublic,
  isValidPrivate,
  randomKey
}
