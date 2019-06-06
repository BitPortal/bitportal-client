import AsyncStorage from '@react-native-community/async-storage'

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

const mergeItem = async (key: string, value: any, json?: boolean) => {
  try {
    const stringValue = (json && !!value) ? JSON.stringify(value) : value
    await AsyncStorage.mergeItem(key, stringValue)
  } catch (error) {
    console.error(`AsyncStorage mergeItem Error: ${error.message}`)
  }
}

const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error(`AsyncStorage removeItem Error: ${error.message}`)
  }
}

const storage = { getItem, setItem, mergeItem, removeItem }

export default storage
