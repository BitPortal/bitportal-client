import { assert } from 'assert'

export const typeOf = value => Object.prototype.toString.call(value).slice(8, -1)

const HEX_REGEX = /^0x[a-fA-F0-9]+$/
const UNPREFIX_HEX_REGEX = /^[a-fA-F0-9]+$/

export function isHex(value, bitLength = -1, ignoreLength = false) {
  const isValidHex = value === '0x' || (typeOf(value) === 'String' && HEX_REGEX.test(value.toString()))

  if (isValidHex && bitLength !== -1) {
    return (value).length === (2 + Math.ceil(bitLength / 4))
  }

  return isValidHex && (ignoreLength || (value.length % 2 === 0))
}

export function hexHasPrefix(value) {
  return !!(value && isHex(value, -1, true) && value.substr(0, 2) === '0x')
}

export function hexStripPrefix(value) {
  if (!value) {
    return ''
  }

  if (hexHasPrefix(value)) {
    return value.substr(2)
  }

  if (UNPREFIX_HEX_REGEX.test(value)) {
    return value
  }

  throw new Error(`Invalid hex ${value} passed to hexStripPrefix`)
}

export function hexToU8a (_value, bitLength = -1) {
  if (!_value) {
    return new Uint8Array()
  }

  assert(isHex(_value), `Expected hex value to convert, found '${_value}'`);

  const value = hexStripPrefix(_value)
  const valLength = value.length / 2
  const bufLength = Math.ceil(
    bitLength === -1
      ? valLength
      : bitLength / 8
  )
  const result = new Uint8Array(bufLength)
  const offset = Math.max(0, bufLength - valLength)

  for (let index = 0; index < bufLength; index++) {
    result[index + offset] = parseInt(value.substr(index * 2, 2), 16)
  }

  return result
}
