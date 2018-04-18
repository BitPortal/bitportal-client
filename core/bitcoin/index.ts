import { HDNode } from 'bitcoinjs-lib'

export const generateBIP44Address = () => {
  const root = HDNode.fromSeedHex('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd')

  return root.derivePath('m/44\'/0\'/0\'/0/0').getAddress()
}
