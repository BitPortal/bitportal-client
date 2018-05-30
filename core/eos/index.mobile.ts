import Eos from 'react-native-eosjs'
import { ENV, EOS_API_URL } from 'constants/env'

const ecc = Eos.modules.ecc
let eos: any

const initAccount = async ({ keyProvider, signProvider }: { keyProvider: string | string[], signProvider: any }) => {
  eos = Eos.Localnet({
    keyProvider: keyProvider,
    httpEndpoint: EOS_API_URL,
    signProvider
  })

  return { eos }
}

const getEOS = () => {
  return eos
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
  isValidPrivate
}
