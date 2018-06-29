import { BITPORTAL_API_REST_URL, BITPORTAL_API_CMS_URL, CURRENCY_RATE_URL } from 'constants/env'
import storage from 'utils/storage'
import { isMobile } from 'utils/platform'

if (!isMobile) require('isomorphic-fetch')

export const fetchBase = async (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  customeHeaders: object = {},
  baseUrl = BITPORTAL_API_REST_URL
) => {
  let url = baseUrl + endPoint
  const token = await storage.getItem('bitportal_t')
  const authorization = token && `Bearer ${token}`

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: authorization || null,
    ...customeHeaders
  }

  const options: any = { method, headers }

  if (method === 'GET') {
    const queryString: string = `${Object.keys(params).map(k => [k, params[k]].map(encodeURIComponent).join('=')).join('&')}`
    if (queryString) url += '?' + queryString
  } else if (method === 'POST' || method === 'PUT') {
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      options.body = `${Object.keys(params).map(k => [k, params[k]].join('=')).join('&')}`
    } else if (headers['Content-Type'] === 'multipart/form-data') {
      delete headers['Content-Type']
      const formData = new FormData()
      Object.keys(params).forEach(key => formData.append(key, params[key]))
      options.body = formData
    } else {
      options.body = JSON.stringify(params)
    }
  }
  // console.log('###', url)
  return fetch(url, baseUrl === BITPORTAL_API_REST_URL ? options : {}).then((res: any) => {
    if (!res.ok) {
      return res.json().then((e: any) => Promise.reject({ message: e.error_msg }))
    }

    const contentType = res.headers.get('content-type')

    if (/json/.test(contentType)) {
      return res.json()
    }

    return null
  })
}

export const sendSMS = (params: SendSMSParams) => fetchBase('POST', '/auth/sms', params)
export const sendEmail = (params: SendEmailParams) => fetchBase('POST', '/auth/email', params)
export const smsLogin = (params: SMSLoginParams) => fetchBase('POST', '/auth/smslogin', params)
export const login = () => fetchBase('POST', '/auth/login')
export const emailCallback = (params: EmailCallbackParams) => fetchBase('GET', `/auth/email/callback/${params.id}`)
export const generateTwoFactor = () => fetchBase('GET', '/auth/two-factor')
export const getUserById = (params: UserIdParams) => fetchBase('GET', `/user/${params.id}`)
export const getUserByToken = () => fetchBase('GET', '/user/getUserByToken')
export const createUser = (params: CreateUserParams) => fetchBase('POST', '/user', params)
export const updateUser = (params: UserIdParams) => fetchBase('PUT', `/user/${params.id}`, params)
export const deleteUser = (params: UserIdParams) => fetchBase('DELETE', `/user/${params.id}`, params)
export const bindUserTwoFactor = (params: BindUserTwoFactorParams) => fetchBase('DELETE', `/user/two-factor/${params.id}`, params)
export const getTickers = (params?: TickerParams) => fetchBase('GET', '/tickers', params)
export const getChart = (params?: ChartParams) => fetchBase('GET', '/chart', params)
export const getNewsList = (params: any) => fetchBase('GET', '/article', params, {}, BITPORTAL_API_CMS_URL)
export const getNewsBanner = () => fetchBase('GET', '/banner', {}, {}, BITPORTAL_API_CMS_URL)
export const getVersionInfo = () => fetchBase('GET', '/system', {}, {}, BITPORTAL_API_CMS_URL)
export const getCurrencyRate = () => fetchBase('GET', '', {}, {}, CURRENCY_RATE_URL)
