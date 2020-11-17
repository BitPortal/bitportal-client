let encoder

function polyfilledEncode (value) {
  const u8a = new Uint8Array(value.length)

  for (let i = 0; i < value.length; i++) {
    u8a[i] = value.charCodeAt(i)
  }

  return u8a
}

try {
  encoder = new TextEncoder()
} catch (error) {
  encoder = {
    encode: polyfilledEncode
  }
}

export function stringToU8a (value) {
  if (!value) {
    return new Uint8Array([])
  }

  return encoder.encode(value)
}
