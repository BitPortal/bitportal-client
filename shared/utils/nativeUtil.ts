
import { NativeModules, Platform } from 'react-native'

const NativeUtils =  NativeModules.NativeUtils

export const getRegisterationID = () => {
  if (Platform.OS === 'ios') {
    return NativeUtils.getRegistrationID('getRegistrationID', (registrationID: string) => registrationID)
  } else {
    return NativeUtils.getRegistrationID().then((data: any) => {
      return data.registrationID
    })
  }
  
}

export const goSettingPermission = () => NativeUtils.goSettingPermission()