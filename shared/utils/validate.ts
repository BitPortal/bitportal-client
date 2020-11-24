import { ASSET_FRACTION } from 'constants/market'
import bitcoin from 'core/library/bitcoin'
import { web3 } from 'core/api'
import{ validatePolkadotAddress } from 'core/keystore/polkadot'

export const validateText = (value: any) => !!value && !!value.trim()

const numberRe = (decimalPlaces: number) => decimalPlaces ? new RegExp(`^\\s*(\\d+(\\.(\\d{1,${decimalPlaces}})?)?|(\\.\\d{1,${decimalPlaces}}))\\s*$`) : new RegExp(`^\\s*(\\d+)\\s*$`)

const validateUnit = (value: any, decimalPlaces: number) => (!!value && !!value.trim() && numberRe(decimalPlaces).test(value))

export const validateUnitByCurrency = (currency: string) => (value: any) => validateUnit(value, ASSET_FRACTION[currency])

export const validateUnitByFraction = (fraction: number) => (value: any) => validateUnit(value, fraction)

export const validateUrl = (value: any) => !!value && /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(value)

export const validateBTCAddress = (value: string) => {
  try {
    bitcoin.address.toOutputScript(value)
    return true
  } catch (e) {
    console.log(e.message)
    return false
  }
}

export const validateETHAddress = (value: string) => web3.utils.isAddress(value)

export const validateEOSAccountName = (value: any) => !!value && /^([1-5]|[a-z.])*$/.test(value) && value.length <= 12

export const validateRioAddress = (value: any) => validatePolkadotAddress(value)
