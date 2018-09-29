import RNFS from 'react-native-fs'

let inject: string = ''

const loadLocalFile = (path: string) => {
  return new Promise((reslove, reject) => {
    RNFS.readFile(path, 'utf8')
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

  return await loadLocalFile(`${RNFS.MainBundlePath}/inject.js`)
}
