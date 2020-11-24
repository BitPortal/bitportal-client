import assert from 'assert'
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