import { Cookies } from 'react-cookie'

let cookies = new Cookies()

const plugToRequest = (req: any) => {
  cookies = new Cookies(req.headers.cookie)
}

const getItem = (name: string, options: {} = {}) => cookies.get(name, options)

const setItem = (name: string, value: any, options: {} = {}) => cookies.set(name, value, options)

const removeItem = (name: string, options: {} = {}) => cookies.remove(name, options)

const storage = { plugToRequest, getItem, setItem, removeItem }

export default storage
