import assert from 'assert'
import coinTypes from './coinTypes.json'

export const BIP44_PURPOSE = 44
export const BIP44_CHAIN_EXTERNAL: bip44Chain = 0
export const BIP44_CHAIN_CHANGE: bip44Chain = 1
export const HARDENED_OFFSET = 0x80000000

export const getCoinType = (coin: string) => coinTypes[coin] - HARDENED_OFFSET

export const getBIP44Path = ({ symbol, account, chain, address }: BIP44PathParams) => {
  assert(typeof symbol === 'string', 'Invalid coin symbol')
  const coinType = getCoinType(symbol)
  assert(coinType, `Can not get coin type for ${symbol}`)
  const accountType = account || 0
  const chainType = chain || BIP44_CHAIN_EXTERNAL
  const addressType = address || 0
  return `m/${BIP44_PURPOSE}'/${coinType}'/${accountType}'/${chainType}/${addressType}`
}

export const isValidBIP44Path = (path: string) => typeof path === 'string' && path.match(/^(m\/44'\/)?(\d+'?\/)*\d+'?$/)
