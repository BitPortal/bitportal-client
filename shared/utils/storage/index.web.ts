import { Cookies } from 'react-cookie'

const getItem = (name: string, options: {} = {}) => Cookies.get(name, options)

const setItem = (name: string, value: any, options: {} = {}) => Cookies.set(name, value, options)

const removeItem = (name: string, options: {} = {}) => Cookies.remove(name, options)

const storage = { getItem, setItem, removeItem }

export default storage
