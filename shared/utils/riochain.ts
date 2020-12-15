import assert from 'assert'
import {createSelector} from 'reselect'
import {chain} from '../core/constants'
import {activeAssetIdSelector, assetByIdSelector} from '../selectors/asset'
export const getAssetUniqueInfo = (wallet, asset) => {
  assert(wallet.chain, 'can not found chain type for wallet')
  assert(wallet.address, 'can not found address type for wallet')

  const chain = wallet.chain
  const address = wallet.address

  if (!asset) {
    return {
      id: `${chain}/${address}/SYSCOIN/RIO`,
      chain,
      address,
      contract: 'SYSCOIN',
      symbol: 'RIO'
    }
  }

  assert(asset.symbol, 'can not found symbol type for wallet')
  assert(asset.decimals, 'can not found decimals type for asset')

  let contract = asset.contract || asset.assetId

  if (!contract && typeof contract !== 'number' && typeof contract !== 'string') {
    contract = 'SYSCOIN'
  }

  const symbol = asset.symbol
  const decimals = asset.decimals

  return {
    id: `${chain}/${address}/${contract}/${symbol}`,
    chain,
    address,
    contract,
    symbol,
    decimals
  }
}

export const getDepositAddressAssetId = (assetId) => {
    switch (assetId) {
      case 0:
      case 2:
      case 102:
        return 103
      default:
        return assetId
    }
}

export const getChain = (asset) => {
  switch (asset) {
    case 'RBTC':
      return 'BTC'
    case 'RETH':
    case 'OM':
    case 'RFUEL':
    case 'RUSDT':
      return 'ETH'
    default:
      return null
  }
}

export const getExternalChainFee = (asset) => {
  switch (asset) {
    case 'RFUEL':
      return '10'
    case 'OM':
      return '10'
    case 'rUSDT':
      return '5'
    case 'rBTC':
      return '0.001'
    case 'rETH':
      return '0.005'
    default:
      return null
  }
}

export const getRioWithdrawChain = (coinType) => {
  if (coinType === 'ETH') {
    return 'ETHEREUM'
  }else if (coinType === 'BTC') {
    return  'BITCOIN'
  }
}

export const getDepositAssetId = (asset) => {
  switch (asset) {
    case 'BTC':
      return 100
    case 'ETH':
      return 103
    default:
      return null
  }
}
export const getExternalChainSymbol = (asset) => {
  switch (asset) {
    case 'RFUEL':
      return 'RFUEL-ERC20'
    case 'OM':
      return 'OM-ERC20'
    case 'RUSDT':
      return 'USDT-ERC20'
    case 'RBTC':
      return 'BTC'
    case 'RETH':
      return 'ETH'
    default:
      return null
  }
}
