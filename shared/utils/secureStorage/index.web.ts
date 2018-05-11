const getItem = async (key: string, json?: boolean) => {
  const value = await localStorage[key]
  return (json && !!value) ? JSON.parse(value) : value
}

const setItem = async (key: string, value: any, json?: boolean) => {
  localStorage[key] = (json && !!value) ? JSON.stringify(value) : value
}

const removeItem = async (key: string) => {
  delete localStorage[key]
}

const getAllItems = async () => await localStorage

const secureStorage = { getItem, setItem, removeItem, getAllItems }

export default secureStorage
