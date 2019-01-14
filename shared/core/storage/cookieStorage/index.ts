import { Cookies } from 'react-cookie'

let cookies = new Cookies()

const plugToRequest = (req: any) => {
  cookies = new Cookies(req.headers.cookie)
}

const getItem = async (name: string, json?: boolean, options: object = {}) => {
  const value = await cookies.get(name, options)
  return (json && !!value) ? JSON.parse(value) : value
}

const getItemSync = (name: string, json?: boolean, options: object = {}) => {
  const value = cookies.get(name, options)
  return (json && !!value) ? JSON.parse(value) : value
}

const setItem = (name: string, value: any, json?: boolean, options: object = {}) => {
  const stringValue = (json && !!value) ? JSON.stringify(value) : value
  cookies.set(name, stringValue, options)
}

const removeItem = (name: string, options: object = {}) => cookies.remove(name, options)

const storage = { plugToRequest, getItem, getItemSync, setItem, removeItem }

export default storage
