import { randomBytes as randombytes } from 'crypto'

const randomBytes = async (length: number): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    randombytes(length, (error, bytes) => {
      if (error) {
        reject(error)
      } else {
        resolve(bytes)
      }
    })
  })
}

export default randomBytes
