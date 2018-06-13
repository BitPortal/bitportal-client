import Eos from 'react-native-eosjs'
import { ENV, EOS_API_URL } from 'constants/env'

const ecc = Eos.modules.ecc
let eos: any

const initAccount = async ({ keyProvider, signProvider }: { keyProvider: string | string[], signProvider: any }) => {
  eos = Eos({
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    httpEndpoint: EOS_API_URL,
    keyProvider,
    signProvider
  })

  return { eos }
}

const initEOS = (options: object = {}) => {
  const chainId = options.chainId || 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
  eos = Eos({ ...options, chainId, httpEndpoint: EOS_API_URL })
  return eos
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

const getProducers = (params: any) => {
  alert(JSON.stringify(params))
  return new Promise((resolve) => {
    eos.getProducers(params).then((result: any) => {
      return resolve(result)
    })
  })
}

const sortProducers = (a: any, b: any) => parseInt(Eos.modules.format.encodeName(a, false)) - parseInt(Eos.modules.format.encodeName(b, false))

export {
  initEOS,
  getEOS,
  initAccount,
  privateToPublic,
  isValidPrivate,
  randomKey,
  getProducers,
  sortProducers
}
