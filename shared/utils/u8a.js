const ALPHABET = '0123456789abcdef'

export function u8aToHex (value, bitLength = -1, isPrefixed = true) {
  const prefix = isPrefixed ? '0x' : ''

  if (!value || !value.length) {
    return prefix
  }

  const byteLength = Math.ceil(bitLength / 8)

  if (byteLength > 0 && value.length > byteLength) {
    const halfLength = Math.ceil(byteLength / 2)

    return `${u8aToHex(value.subarray(0, halfLength), -1, isPrefixed)}…${u8aToHex(value.subarray(value.length - halfLength), -1, false)}`
  }

  return value.reduce((result, value) => {
    return result + ALPHABET[value >> 4] + ALPHABET[value & 15]
  }, prefix)
}
