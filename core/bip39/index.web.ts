import bip39 from 'bip39'

export const generateMnemonic = async () => await bip39.generateMnemonic()
export const entropyToMnemonic = (entropy: any, wordlist?: string[]) => bip39.entropyToMnemonic(entropy, wordlist)
export const mnemonicToSeed = (mnemonic: string, password?: string) => bip39.mnemonicToSeed(mnemonic, password)
export const mnemonicToSeedHex = (mnemonic: string, password?: string) => bip39.mnemonicToSeed(mnemonic, password).toString('hex')
export const isValidMnemonic = (mnemonic: string) => bip39.validateMnemonic(mnemonic)
