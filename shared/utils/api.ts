import cookie from 'react-cookie'
import { GATEWAY_API_URL } from 'constants/env'
import { isMobile } from 'utils/platform'

if (!isMobile) require('isomorphic-fetch')

export const fetchBase = (method: FetchMethod = 'GET', endPoint: string = '/hello', params: object = {}, customeHeaders: object = {}) => {
  let url = GATEWAY_API_URL + endPoint
  const token = (!isMobile && cookie.load('dae_t')) ? `Bearer ${cookie.load('dae_t')}` : null

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: token,
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

  return fetch(url, options).then((res: any) => {
    if (!res.ok) {
      return res.json().then((e: any) => Promise.reject({ message: e.error }))
    }

    const contentType = res.headers.get('content-type')

    if (/json/.test(contentType)) {
      return res.json()
    }
    if (/text/.test(contentType)) {
      return res.text()
    }
    if (/image\/png/.test(contentType)) {
      return res.blob().then((blob: string) => URL.createObjectURL(blob))
    }
    return null
  })
}

export const register = (params: object) => fetchBase('POST', '/register', params)
