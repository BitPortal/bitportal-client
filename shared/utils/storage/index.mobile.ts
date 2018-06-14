import { AsyncStorage } from 'react-native'


/**
 *  本地存储key-value结构值：
 *    bitportal_lang: string                 eg: zh/en                  // 语言
 *    bitportal_welcome: object              eg: { localVersion: string }    // 是否第一次开启app
 *    bitportal_status_bar: string           eg: default/light-content  // 状态栏模式(根据夜间模式调换)
 *    bitportal_t: string                                               // 用户Token
 */

const getItem = async (key: string, json?: boolean) => {
  try {
    const value = await AsyncStorage.getItem(key)
    return (json && !!value) ? JSON.parse(value) : value
  } catch (error) {
    console.error(`AsyncStorage getItem Error: ${error.message}`)
  }
}

const setItem = async (key: string, value: any, json?: boolean) => {
  try {
    const stringValue = (json && !!value) ? JSON.stringify(value) : value
    await AsyncStorage.setItem(key, stringValue)
  } catch (error) {
    console.error(`AsyncStorage setItem Error: ${error.message}`)
  }
}

const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error(`AsyncStorage removeItem Error: ${error.message}`)
  }
}

const storage = { getItem, setItem, removeItem }

export default storage
