import { pbkdf2 } from 'crypto'

const pbkdf2Async = async (password: string, salt: string, iterations: number, keylen: number, digest: string) => {
  return new Promise<string>((resolve, reject) => {
    pbkdf2(password, salt, iterations, keylen, digest, (error: any, derivedKey: Buffer) => {
      if (error) {
        reject(error)
      } else {
        resolve(derivedKey.toString('hex'))
      }
    })
  })
}

export default pbkdf2Async
