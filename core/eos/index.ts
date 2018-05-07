import Eos from 'eosjs'

export const generateMasterKeys = async () => {
  const eos = Eos.Testnet()
  const result = await eos.getBlock(1)
  console.log(result)
}
