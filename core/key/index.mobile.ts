import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import HDKey from 'hdkey'
import wif from 'wif'
import { createHash, createHmac } from 'crypto'
import ecc from 'react-native-eosjs-ecc'

export const getBIP32Path = ({ coin_type, account, change, address_index }: BIP32Path) => `m/${purpose}'/${coin_type}'/${account}'/${change}/${address_index}`

// seed
export const generateHDAccount = () => {
  const mnemonic = await bip39.generateMnemonic()
}

export const importHDAccountFromMnemonic = (mnemonic: string) => {

}

export const test = async () => {
  const mnemonic = await bip39.generateMnemonic()
  const seedHex = bip39.mnemonicToSeedHex(mnemonic)
  console.log('seedHex', seedHex)
  const root = HDKey.fromMasterSeed(new Buffer(seedHex, 'hex'))
  const ethNode = root.derive('m/44\'/60\'/0\'/0/0')
  const btcNode = root.derive('m/44\'/0\'/0\'/0/0')
  const eosNode = root.derive('m/44\'/194\'/0\'/0/0')
  console.log('btc', btcNode.privateKey.toString('hex'))
  console.log('eth', ethNode.privateKey.toString('hex'))
  console.log('eos', eosNode.privateKey.toString('hex'))
  console.log(wif.encode(128, btcNode.privateKey, true))
  const keyPair = bitcoin.ECPair.fromWIF(wif.encode(128, btcNode.privateKey, true))
  const address = keyPair.getAddress()
  console.log(address)
  const chainCode = Buffer.from('00'.repeat(32), 'hex') // testnet is '00'.repeat(32), replace with real chainCode
  const MASTER_SALT = chainCode
  const chainSeedBuffer = createHmac('sha256', MASTER_SALT).update(new Buffer(seedHex, 'hex')).digest()
  const owner = createHash('sha256').update(chainSeedBuffer).update('owner').digest()
  console.log('owner', wif.encode(128, owner))
  console.log('owner', ecc.isValidPrivate(wif.encode(128, owner)))
}
