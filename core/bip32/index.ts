import hdkey from 'hdkey'

export const fromMasterSeed = (seed: Buffer) => hdkey.fromMasterSeed(seed)
export const derive = (path: string) => hdkey.derive(path)
export const isValidBIP32Path = (path: string) => typeof path === 'string' && path.match(/^(m\/)?(\d+'?\/)*\d+'?$/)
