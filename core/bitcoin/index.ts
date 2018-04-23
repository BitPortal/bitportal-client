import { HDNode } from 'bitcoinjs-lib'

export const generateBIP44Address = ({ coin_type, account, change, address_index }: BIP32Path) => {
  const purpose = 44
  const root = HDNode.fromSeedHex('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd')
  const child = root.derivePath(`m/${purpose}'/${coin_type}'/${account}'/${change}/${address_index}`)
  const address = child.getAddress()
  return address
}
