
import { NativeModules } from 'react-native'

const NativeUtils =  NativeModules.NativeUtils


export const getRegisterationID = async () => {
  NativeUtils.getRegistrationID('getRegistrationID', (registrationID: string) => {
    return registrationID
  })
}

export const goSettingPermission = () => NativeUtils.goSettingPermission()