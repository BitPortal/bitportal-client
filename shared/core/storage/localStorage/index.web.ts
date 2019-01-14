import assert from 'assert'

let store = localStorage

const getItem = async (key: string, json?: boolean) => {
  try {
    assert(key, 'Invalid storage key')
    const value = store[key]
    return (json && !!value) ? JSON.parse(value) : value
  } catch (error) {
    console.error(`MemoryStorage getItem Error: ${error.message}`)
  }
}

const setItem = async (key: string, value: any, json?: boolean) => {
  try {
    assert(key, 'Invalid storage key')
    const stringValue = (json && !!value) ? JSON.stringify(value) : value
    assert(typeof stringValue === 'string' && stringValue && stringValue !== 'null' && stringValue !== 'undefined', 'Invalid storage value')
    store[key] = stringValue
  } catch (error) {
    console.error(`MemoryStorage setItem Error: ${error.message}`)
  }
}

const removeItem = async (key: string) => {
  try {
    delete store[key]
  } catch (error) {
    console.error(`MemoryStorage removeItem Error: ${error.message}`)
  }
}

const getAllItems = async () => {
  try {
    return store
  } catch (error) {
    console.error(`MemoryStorage getAllItems Error: ${error.message}`)
  }
}

const storage = { getItem, setItem, removeItem, getAllItems }

export default storage
