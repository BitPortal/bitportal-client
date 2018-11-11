import scryptAsync from 'scrypt-async'

const scrypt = async (password: string, salt: string, N: number, r: number, p: number, dkLen: number) => {
  return new Promise<string>((resolve) => {
    scryptAsync(password, salt, {
      N, r, p, dkLen, encoding: 'hex'
    }, (derivedKey: string) => {
      resolve(derivedKey)
    })
  })
}

export default scrypt
