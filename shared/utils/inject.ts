import { Platform } from 'react-native'
import RNFS from 'react-native-fs'

let scatter: string = ''
let metamask: string = ''

export const rootPath = Platform.OS === 'ios' ? RNFS.MainBundlePath : 'raw'
const readFile = Platform.OS === 'ios' ? RNFS.readFile : RNFS.readFileAssets

const loadScatterFile = (path: string) => {
  return new Promise((reslove, reject) => {
    readFile(path, 'utf8')
      .then((contents: string) => {
        scatter = contents
        reslove(contents)
      }).catch((error: any) => {
        reject(error)
      })
  })
}

export const loadScatter = async () => {
  if (scatter) return scatter

  return await loadScatterFile(`${rootPath}/injectScatter.js`)
}

export const loadScatterSync = () => {
  return scatter
}

const loadMetaMaskFile = (path: string) => {
  return new Promise((reslove, reject) => {
    readFile(path, 'utf8')
      .then((contents: string) => {
        metamask = contents
        reslove(contents)
      }).catch((error: any) => {
        reject(error)
      })
  })
}

export const loadMetaMask = async () => {
  if (metamask) return metamask

  return await loadMetaMaskFile(`${rootPath}/injectMetaMask.js`)
}

export const loadMetaMaskSync = () => {
  return metamask
}
