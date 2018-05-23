import wif from 'wif'

export const encode = (version: number, privateKey: Buffer, compressed: boolean = true) => wif.encode(version, privateKey, compressed)
export const decode = (key: string, version: number) => wif.decode(key, version)
