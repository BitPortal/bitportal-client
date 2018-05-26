import Eos from 'eosjs'
import { EOS_API_URL } from 'constants/env'

const ecc = Eos.modules.ecc
let eos: any

const initAccount = async ({ name, keyProvider }: { name: string, keyProvider: string | string[] }) => {
  eos = Eos.Localnet({
    keyProvider: keyProvider,
    httpEndpoint: EOS_API_URL
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
