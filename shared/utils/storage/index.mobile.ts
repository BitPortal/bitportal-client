import { AsyncStorage } from 'react-native'

const getItem = async (key: string) => {
  try {
    const item = await AsyncStorage.getItem(key)
    return item
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
