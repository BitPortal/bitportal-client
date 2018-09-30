import { Platform } from 'react-native'
import RNFS from 'react-native-fs'

let inject: string = ''

export const rootPath = Platform.OS === 'ios' ? RNFS.MainBundlePath : 'raw'
const readFile = Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets

const loadLocalFile = (path: string) => {
  return new Promise((reslove, reject) => {
    readFile(path, 'utf8')
      .then((contents: string) => {
        inject = contents
        reslove(contents)
      }).catch((error: any) => {
        reject(error)
      })
  })
}

export const loadInject = async () => {
  if (inject) return inject

  return await loadLocalFile(`${rootPath}/inject.js`)
}

export const loadInjectSync = () => {
  return inject
}
