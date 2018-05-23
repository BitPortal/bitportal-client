import hdkey from 'hdkey'

export const fromMasterSeed = (seed: Buffer) => hdkey.fromMasterSeed(seed)
export const isValidBIP32Path = (path: string) => typeof path === 'string' && path.match(/^(m\/)?(\d+'?\/)*\d+'?$/)
