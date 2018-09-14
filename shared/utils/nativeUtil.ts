
import { NativeModules, Platform } from 'react-native'

const NativeUtils =  NativeModules.NativeUtils


export const getRegisterationID = async () => {
  if (Platform.OS === 'ios') {
    NativeUtils.getRegistrationID('getRegistrationID', (registrationID: string) => {
      return registrationID
    })
  } else {
    NativeUtils.getRegistrationID().then((data: any) => {
      return data.registrationID
    })
  }
  
}

export const goSettingPermission = () => NativeUtils.goSettingPermission()