import { NativeModules } from 'react-native'

const { pbkdf2 } = NativeModules.BPCoreModule

export default pbkdf2
