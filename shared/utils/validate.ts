import { ASSET_FRACTION } from 'constants/market'

export const validateText = (value: any) => !!value && !!value.trim()

const numberRe = (decimalPlaces: number) => decimalPlaces ? new RegExp(`^\\s*(\\d+(\\.(\\d{1,${decimalPlaces}})?)?|(\\.\\d{1,${decimalPlaces}}))\\s*$`) : new RegExp(`^\\s*(\\d+)\\s*$`)

const validateUnit = (value: any, decimalPlaces: number) => (!!value && !!value.trim() && numberRe(decimalPlaces).test(value))

export const validateUnitByCurrency = (currency: string) => (value: any) => validateUnit(value, ASSET_FRACTION[currency])

export const validateUnitByFraction = (fraction: number) => (value: any) => validateUnit(value, fraction)

export const validateEOSAccountName = (value: any) => !!value && /([1-5]|[a-z])+$/.test(value) && value.length === 12
