import  { NativeModules } from 'react-native'
const LocalesInterface = NativeModules.LocalesInterface

export const getLocaleLanguage = () => {


  let language = 'en'
  // @ts-ignore
  LocalesInterface.getSystemLocales(value => {
  })
  // if ((DeviceInfo.LocalesInterface().indexOf('zh') !== -1)) {
  //   language = 'zh'
  // } else if ((DeviceInfo.getDeviceLocale().indexOf('ko') !== -1)) {
  //   language = 'ko'
  // }
  return language
}
