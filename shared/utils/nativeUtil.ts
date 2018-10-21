
import { NativeModules, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

const NativeUtils =  NativeModules.NativeUtils

export const getRegisterationID = () => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve) => {
      NativeUtils.getRegistrationID('getRegistrationID', (registrationID: string) => {
        resolve(registrationID)
      })
    })
  } else {
    return NativeUtils.getRegistrationID().then((data: any) => {
      return data.registrationID
    })
  }
}

export const getDeviceID = () => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve) => {
      NativeUtils.getDeviceID('getDeviceID', (deviceID: string) => {
        resolve(deviceID)
      })
    })
  } else {
    return new Promise((resolve) => {
      const deviceID = DeviceInfo.getDeviceId()
      resolve(deviceID)
    })
  }
}

export const goSettingPermission = () => NativeUtils.goSettingPermission()