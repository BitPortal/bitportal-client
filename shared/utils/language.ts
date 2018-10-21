import DeviceInfo from 'react-native-device-info'

export const getLocaleLanguage = () => {
  let language = 'en'
  if ((DeviceInfo.getDeviceLocale().indexOf('zh') !== -1)) {
    language = 'zh'
  } else if ((DeviceInfo.getDeviceLocale().indexOf('ko') !== -1)) {
    language = 'ko'
  }
  return language
}