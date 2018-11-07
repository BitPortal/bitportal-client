import {
  BITPORTAL_API_REST_URL,
  BITPORTAL_API_MARKET_URL,
  BITPROTAL_API_TRACE_URL,
  BITPORTAL_API_CMS_URL,
  CURRENCY_RATE_URL
} from 'constants/env'
import storage from 'utils/storage'
import { isMobile } from 'utils/platform'
import { Platform } from 'react-native'

if (!isMobile) require('isomorphic-fetch')

export const fetchBase = async (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: FetchOptions = {}
) => {
  const baseUrl = options.baseUrl || BITPORTAL_API_REST_URL
  const headers = options.headers || {}
  const auth = options.auth

  let url = baseUrl + endPoint

  if (!headers.Accept) headers.Accept = 'application/json'
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'

  if (auth) {
    const token = await storage.getItem('bitportal_t')
    const authorization = token && `Bearer ${token}`
    headers.Authorization = authorization || null
  }

  const fetchOptions: any = { method, headers }

  if (method === 'GET') {
    const queryString: string = `${Object.keys(params)
      .map(k => [k, params[k]].map(encodeURIComponent).join('='))
      .join('&')}`
    if (queryString) url += `?${queryString}`
  } else if (method === 'POST' || method === 'PUT') {
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      fetchOptions.body = `${Object.keys(params)
        .map(k => [k, params[k]].join('='))
        .join('&')}`
    } else if (headers['Content-Type'] === 'multipart/form-data') {
      delete headers['Content-Type']
      const formData = new FormData()
      Object.keys(params).forEach(key => formData.append(key, params[key]))
      fetchOptions.body = formData
    } else {
      fetchOptions.body = JSON.stringify(params)
    }
  }
  console.log('###---xx ', url)

  return fetch(url, fetchOptions).then((res: any) => {
    if (!res.ok) return res.json().then((e: any) => Promise.reject({ message: e }))
    const contentType = res.headers.get('content-type')
    if (/json/.test(contentType)) return res.json()
    return null
  })
}

const cmsFetchBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) =>
  fetchBase(method, endPoint, params, {
    ...options,
    baseUrl: BITPORTAL_API_CMS_URL
  })

const marketFetchBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) =>
  fetchBase(method, endPoint, params, {
    ...options,
    baseUrl: 'http://market.corp.bitportal.io/api/v2'
  })

const traceFetchBase = (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: object = {}
) =>
  fetchBase(method, endPoint, params, {
    ...options,
    baseUrl: BITPROTAL_API_TRACE_URL
  })

export const getTickers = (params?: TickerParams) => {
  console.log('getTickers')
  return marketFetchBase('GET', '/tickers', params)
}
export const getChart = (params: ChartParams) => {
  const { chartType, ...excludeChartType } = params
  return marketFetchBase('GET', `/charts/${chartType}`, excludeChartType)
}
export const getCurrencyRate = () => fetchBase('GET', '', {}, { baseUrl: CURRENCY_RATE_URL })
export const getNewsList = (params: any) => cmsFetchBase('GET', '/article', params)
export const getNewsBanner = (params: any) => cmsFetchBase('GET', '/banner', params)
export const getVersionInfo = () => cmsFetchBase('GET', '/system')
export const getProducersInfo = (params: any) => cmsFetchBase('GET', '/eosbp', params)
export const getTokenDetail = (params: any) => cmsFetchBase('GET', '/token', params)
export const getDappList = (params: any) => cmsFetchBase('GET', '/eosdapp', params)
export const getEOSAsset = (params: any) => cmsFetchBase('GET', '/eostoken', params)
export const createEOSAccount = (params: any) => fetchBase('POST', '/registry/wallets/campaign/eoscreation', params)
export const importEOSAccount = (params: any) => fetchBase('POST', '/registry/wallets/import', params)

export const subscribe = (params: any) => traceFetchBase('POST', '/notification/subscribe', params)
export const unsubscribe = (params: any) => traceFetchBase('POST', '/notification/unsubscribe', params)

export const traceTransaction = (params: any) => traceFetchBase('POST', '/transaction', params)
export const traceStake = (params: any) => traceFetchBase('POST', '/stake', params)
export const traceVotes = (params: any) => traceFetchBase('POST', '/votes', params)
export const traceImport = (params: any) => traceFetchBase('POST', '/registry/wallets/import', params)
