import { Platform } from 'react-native'
import RNFS from 'react-native-fs'

let inject = ''

export const rootPath = Platform.OS === 'ios' ? RNFS.MainBundlePath : 'raw'
const readFile = Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets

const loadLocalFile = (path: string) =>
  new Promise((resolve, reject) => {
    readFile(path, 'utf8')
      .then((contents: string) => {
        inject = contents
        resolve(inject)
      })
      .catch((error: any) => {
        reject(error)
      })
  })

export const loadInject = async () => {
  if (inject) return inject

  return await loadLocalFile(`${rootPath}/inject.js`)
}

export const loadInjectSync = () => inject
