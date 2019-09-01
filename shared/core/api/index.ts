import Web3 from 'web3'
import Eos from 'react-native-eosjs'
import {
  btcNodes,
  ethNodes,
  eosNodes,
  eosMainnetChainId,
  etherscanApiKey
} from 'core/constants'

export const insightApi = async (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: FetchOptions = {}
) => {
  const baseUrl = btcNodes[0] + '/api'
  const headers = options.headers || {}

  let url = baseUrl + endPoint

  if (!headers.Accept) headers.Accept = 'application/json'
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'

  const fetchOptions: any = { method, headers }

  if (method === 'GET') {
    const queryString: string = `${Object.keys(params)
      .map(k => [k, params[k]].map(encodeURIComponent).join('='))
      .join('&')}`
    if (queryString) url += `?${queryString}`
  } else if (method === 'POST' || method === 'PUT') {
    fetchOptions.body = JSON.stringify(params)
  }

  return fetch(url, fetchOptions).then((res: any) => {
    if (!res.ok) {
      if (/json/.test(contentType)) {
        return res.json().then((e: any) => Promise.reject({ message: e }))
      } else {
        return Promise.reject({ message: res._bodyInit })
      }
    }

    const contentType = res.headers.get('content-type')

    if (/json/.test(contentType)) {
      return res.json()
    }

    return null
  })
}

export const chainSoApi = async (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: FetchOptions = {}
) => {
  const baseUrl = 'https://chain.so' + '/api/v2'
  const headers = options.headers || {}

  let url = baseUrl + endPoint

  if (!headers.Accept) headers.Accept = 'application/json'
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'

  const fetchOptions: any = { method, headers }

  if (method === 'GET') {
    const queryString: string = `${Object.keys(params)
      .map(k => [k, params[k]].map(encodeURIComponent).join('='))
      .join('&')}`
    if (queryString) url += `?${queryString}`
  } else if (method === 'POST' || method === 'PUT') {
    fetchOptions.body = JSON.stringify(params)
  }

  return fetch(url, fetchOptions).then((res: any) => {
    if (!res.ok) {
      return res.json().then((e: any) => Promise.reject({ message: e.data.tx_hex }))
    }

    const contentType = res.headers.get('content-type')

    if (/json/.test(contentType)) {
      return res.json()
    }

    return null
  })
}

export const blockCypherApi = async (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: FetchOptions = {}
) => {
  const baseUrl = 'https://api.blockcypher.com/v1'
  const headers = options.headers || {}

  let url = baseUrl + endPoint

  if (!headers.Accept) headers.Accept = 'application/json'
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'

  const fetchOptions: any = { method, headers }

  if (method === 'GET') {
    const queryString: string = `${Object.keys(params)
      .map(k => [k, params[k]].map(encodeURIComponent).join('='))
      .join('&')}`
    if (queryString) url += `?${queryString}`
  } else if (method === 'POST' || method === 'PUT') {
    fetchOptions.body = JSON.stringify(params)
  }

  return fetch(url, fetchOptions).then((res: any) => {
    if (!res.ok) {
      return res.json().then((e: any) => Promise.reject({ message: e }))
    }

    const contentType = res.headers.get('content-type')

    if (/json/.test(contentType)) {
      return res.json()
    }

    return null
  })
}

export const etherscanApi = async (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: FetchOptions = {}
) => {
  const baseUrl = 'http://api.etherscan.io' + '/api'
  const headers = options.headers || {}
  const paramsWithApiKey = { ...params, apikey: etherscanApiKey }

  let url = baseUrl + endPoint

  if (!headers.Accept) headers.Accept = 'application/json'
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'

  const fetchOptions: any = { method, headers }

  if (method === 'GET') {
    const queryString: string = `${Object.keys(paramsWithApiKey)
      .map(k => [k, paramsWithApiKey[k]].map(encodeURIComponent).join('='))
      .join('&')}`
    if (queryString) url += `?${queryString}`
  } else if (method === 'POST' || method === 'PUT') {
    fetchOptions.body = JSON.stringify(paramsWithApiKey)
  }

  return fetch(url, fetchOptions).then((res: any) => {
    if (!res.ok) {
      return res.json().then((e: any) => Promise.reject({ message: e.data.tx_hex }))
    }

    const contentType = res.headers.get('content-type')

    if (/json/.test(contentType)) {
      return res.json()
    }

    return null
  })
}

export const web3 = new Web3(new Web3.providers.HttpProvider(ethNodes[0]))
export const eos = Eos({ chainId: eosMainnetChainId, httpEndpoint: eosNodes[0] })
export const ecc = Eos.modules.ecc
export const eosFormat = Eos.modules.format

export const initEOS = async (options: any) => {
  const chainId = eosMainnetChainId
  const httpEndpoint = options.httpEndpoint || eosNodes[0]
  return Eos({ ...options, chainId, httpEndpoint })
}

export const chainxScanApi = async (
  method: FetchMethod = 'GET',
  endPoint: string = '/hello',
  params: object = {},
  options: FetchOptions = {}
) => {
  const baseUrl = 'https://api.chainx.org.cn'
  const headers = options.headers || {}
  const paramsWithApiKey = { ...params }

  let url = baseUrl + endPoint

  if (!headers.Accept) headers.Accept = 'application/json'
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'

  const fetchOptions: any = { method, headers }

  if (method === 'GET') {
    const queryString: string = `${Object.keys(paramsWithApiKey)
      .map(k => [k, paramsWithApiKey[k]].map(encodeURIComponent).join('='))
      .join('&')}`
    if (queryString) url += `?${queryString}`
  } else if (method === 'POST' || method === 'PUT') {
    fetchOptions.body = JSON.stringify(paramsWithApiKey)
  }

  return fetch(url, fetchOptions).then((res: any) => {
    if (!res.ok) {
      return res.json().then((e: any) => Promise.reject({ message: e.data.tx_hex }))
    }

    const contentType = res.headers.get('content-type')

    if (/json/.test(contentType)) {
      return res.json()
    }

    return null
  })
}
