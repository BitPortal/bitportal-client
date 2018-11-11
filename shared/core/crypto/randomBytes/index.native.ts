import * as RNRandomBytes from 'react-native-randombytes'

const randomBytes = async (length: number): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    RNRandomBytes.randomBytes(length, (error: any, bytes: any) => {
      if (error) {
        reject(error)
      } else {
        resolve(bytes)
      }
    })
  })
}

export default randomBytes
