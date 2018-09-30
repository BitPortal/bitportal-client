import assert from 'assert'

const getItem = async (key: string, json?: boolean) => {
  assert(key, 'Invalid storage key')
  const value = await localStorage[key]
  return (json && !!value) ? JSON.parse(value) : value
}

const setItem = async (key: string, value: any, json?: boolean) => {
  assert(key, 'Invalid storage key')
  const stringValue = (json && !!value) ? JSON.stringify(value) : value
  assert(typeof stringValue === 'string' && stringValue && stringValue !== 'null' && stringValue !== 'undefined', 'Invalid storage value')
  localStorage[key] = stringValue
}

const removeItem = async (key: string) => {
  delete localStorage[key]
}

const getAllItems = async () => await localStorage

const secureStorage = { getItem, setItem, removeItem, getAllItems }

export default secureStorage
