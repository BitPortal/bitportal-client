import { ASSET_FRACTION } from 'constants/market'

export const normalizeVcode = (value: any, previousValue: any) => (value && ((/^\d+$/.test(value) && value.length <= 6) ? value.trim() : previousValue))

export const normalizeCaptch = (value: any, previousValue: any) => (value && ((/^\w+$/.test(value) && value.length <= 4) ? value.trim() : previousValue))

export const normalizeText = (value: any, previousValue: any) => (value && (!/\s/.test(value) ? value.trim() : previousValue))

export const normalizePrivateKey = (value: any) => (value && value.replace(/\s/g, ''))

export const normalizeMemo = (value: any, previousValue: any) => (value && (!/(\s|\\|\_|\/|\&|\^|\#|\@|\$|\<|\>|\*|\~|\`|\-|\%)/.test(value) ? value.trim() : previousValue))

export const normalizePasswordText = (value: any, previousValue: any) => (value && ((value.trim().length <= 32 && !/[^\x00-\xff]/.test(value.trim())) ? value.trim() : previousValue))

export const normalizeNickNameText = (value: any, previousValue: string) => (value.split('').reduce((s: any, x: any) => (/[\u4e00-\u9fa5]/.test(x) ? s + 2 : s + 1), 0) > 20 ? previousValue : value.trim())

export const normalizeTradePassword = (value: any, previousValue: any) => (value && ((/^\d+$/.test(value) && value.length <= 6) ? value.trim() : previousValue))

export const normalizeIdCard = (value: any, previousValue: any) => (value && (/^\d+(x?|X?)$/.test(value) ? value.trim() : previousValue))

export const normalizePhone = (value: any, previousValue: any) => (value && (/^\d+$/.test(value) ? value.trim() : previousValue))

export const normalizeBankAccount = (value: any, previousValue: any) => (value && (/^\d+$/.test(value.replace(/\s/g, '')) ? value.replace(/\s/g, '').match(/.{1,4}/g).join(' ') : previousValue))

const numberRe = (decimalPlaces: number) => decimalPlaces ? new RegExp(`^\\s*(\\d+(\\.(\\d{1,${decimalPlaces}})?)?|(\\.\\d{1,${decimalPlaces}}))\\s*$`) : new RegExp(`^\\s*(\\d+)\\s*$`)

const normalizeUnit = (value: any, previousValue: any, decimalPlaces: number) => (value && (numberRe(decimalPlaces).test(value) ? value.trim() : previousValue))

export const normalizeUnitByCurrency = (currency: string) => (value: any, previousValue: any) => normalizeUnit(value, previousValue, ASSET_FRACTION[currency])

export const normalizeUnitByFraction = (fraction: number) => (value: any, previousValue: any) => normalizeUnit(value, previousValue, fraction)

export const normalizeEOSAccountName = (value: any, previousValue: any) => (value && ((/([1-5]|[a-z])+$/.test(value) && value.length < 13) ? value.trim() : previousValue))
