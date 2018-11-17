import scryptAsync from 'scrypt-async'

const scrypt = async (password: string, salt: string, N: number, r: number, p: number, dkLen: number) => {
  return new Promise<string>((resolve) => {
    scryptAsync(Buffer.from(password, 'hex'), Buffer.from(salt, 'hex'), {
      N, r, p, dkLen, encoding: 'hex'
    }, (derivedKey: string) => {
      resolve(derivedKey)
    })
  })
}

export default scrypt
