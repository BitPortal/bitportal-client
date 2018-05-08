import SensitiveInfo from 'react-native-sensitive-info'

const getItem = async (key: string) => {
  try {
    const value = await SensitiveInfo.getItem(key, {
      sharedPreferencesName: 'BitportalSharedPrefs',
      keychainService: 'BitportalKeychain'
    })
    return value
  } catch (error) {
    console.error(`SecureStorage getItem Error: ${error.message}`)
  }
}

const setItem = async (key: string, value: any) => {
  try {
    await SensitiveInfo.setItem(key, value, {
      sharedPreferencesName: 'BitportalSharedPrefs',
      keychainService: 'BitportalKeychain',
      encrypt: true
    })
  } catch (error) {
    console.error(`SecureStorage setItem Error: ${error.message}`)
  }
}

const removeItem = async (key: string) => {
  try {
    await SensitiveInfo.deleteItem(key, {
      sharedPreferencesName: 'BitportalSharedPrefs',
      keychainService: 'BitportalKeychain'
    })
  } catch (error) {
    console.error(`SecureStorage removeItem Error: ${error.message}`)
  }
}

const getAllItems = async () => {
  try {
    let items = await SensitiveInfo.getAllItems({
      sharedPreferencesName: 'BitportalSharedPrefs',
      keychainService: 'BitportalKeychain'
    })

    if (toString.call(items).slice(8, -1) === 'Array') {
      return items[0].reduce((o: any, i: any) => ({ ...o, [i.key]: i.value }), {})
    }

    return items
  } catch (error) {
    console.error(`SecureStorage getAllItems Error: ${error.message}`)
  }
}

const secureStorage = { getItem, setItem, removeItem, getAllItems }

export default secureStorage
