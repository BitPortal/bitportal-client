import { Cookies } from 'react-cookie'

let cookies = new Cookies()

const plugToRequest = (req: any) => {
  cookies = new Cookies(req.headers.cookie)
}

const getItem = async (name: string, options: object = {}) => await cookies.get(name, options)

const getItemSync = (name: string, options: object = {}) => cookies.get(name, options)

const setItem = (name: string, value: any, options: object = {}) => cookies.set(name, value, options)

const removeItem = (name: string, options: object = {}) => cookies.remove(name, options)

const storage = { plugToRequest, getItem, getItemSync, setItem, removeItem }

export default storage
