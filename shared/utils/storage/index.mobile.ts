import { AsyncStorage } from 'react-native'


/**
 *  本地存储key-value结构值：
 *    bitportal_lang: string -- zh/en // 语言
 *    bitportal_welcome: object -- { isFirst: bolean } // 是否第一次开启app
 *    bitportal_status_bar: string -- default/light-content // 状态栏模式(根据夜间模式调换)
 *    bitportal_t: string // 用户Token
 *    bitportal_assets_info: object -- { data: [...] } // 资产信息(数组内部结构查看对应reducer)
 */ 

const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value
  } catch (error) {
    console.error(`AsyncStorage getItem Error: ${error.message}`)
  }
}

const setItem = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value)
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

