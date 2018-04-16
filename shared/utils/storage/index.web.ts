import { Cookies } from 'react-cookie'

const cookies = new Cookies()

const getItem = (name: string, options: {} = {}) => cookies.get(name, options)

const setItem = (name: string, value: any, options: {} = {}) => cookies.set(name, value, options)

const removeItem = (name: string, options: {} = {}) => cookies.remove(name, options)

const storage = { getItem, setItem, removeItem }

export default storage
