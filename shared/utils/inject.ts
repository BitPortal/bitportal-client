import {Platform} from 'react-native'
import RNFS from 'react-native-fs'

let scatter: string = ''
let metamask: string = ''
let polkadotJsFile: string = ''

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

  return ''
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

const loadPolkadotFile = (path: string) => {
  return new Promise((reslove, reject) => {
    readFile(path, 'utf8')
      .then((contents: string) => {
        console.warn('loadPolkadotFile:',contents)
        polkadotJsFile = contents
        reslove(contents)
      }).catch((error: any) => {
        console.warn('err:',error);
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

export const loadPolkadotExt = async () => {
  console.warn('loadPolkadotExt:',polkadotJsFile);
  if (polkadotJsFile && polkadotJsFile.length) return polkadotJsFile
  console.warn('loadPolkadotExt 1:',`${rootPath}/injectPolkadot.js`);
  return await loadPolkadotFile(`${rootPath}/injectPolkadot.js`)
}

export const loadPolkadotExtSync = () => {
  console.warn('loadPolkadotExtSync:',polkadotJsFile);
  return polkadotJsFile
}
