import Colors from 'resources/colors'

const multiple = (position: number): number => (!position ? 1 : 10 * multiple(position - 1))

export const roundDown = (value: number, decimal: number) => value && Math.floor(value * multiple(decimal)) / multiple(decimal)

export const roundUp = (value: number, decimal: number) => value && Math.ceil(value * multiple(decimal)) / multiple(decimal)

export const errorLoading = (err: string) => console.error('Dynamic page loading failed: ', err)

export const typeOf = (value: any) => Object.prototype.toString.call(value).slice(8, -1)

const loadedScripts: string[] = []

const { onEventObject } = require('./analytics')
import { ERROR_GET_MESSAGE } from 'constants/analytics'

export const loadScript = (src: string) => new Promise((resolve, reject) => {
  if (~loadedScripts.indexOf(src)) {
    resolve()
  } else {
    const script = document.createElement('script')
    script.src = src
    script.addEventListener('load', () => {
      loadedScripts.push(src)
      resolve()
    })
    script.addEventListener('error', (e) => {
      reject(e)
    })
    document.head.appendChild(script)
  }
})

export const getErrorMessage = (error: any) => {
  if (
    (typeOf(error) === 'Error' && error.message.indexOf('.cpp') !== -1)
      || (typeOf(error) === 'Object'
          && typeof error.message === 'string'
          && error.message.indexOf('.cpp') !== -1)
  ) {
    const errorObject = JSON.parse(error.message)

    // Todo:: delete when it's table enough
    try {
      onEventObject(ERROR_GET_MESSAGE, errorObject)
    } catch (e) {console.error(e)}

    if (
      errorObject.error
        && errorObject.error.details
        && errorObject.error.details.length
        && errorObject.error.details[0].message
    ) {
      return errorObject.error.details[0].message
    }

    if (errorObject.error && errorObject.error.what) {
      return errorObject.error.what
    }
  }

  if (typeof error === 'string') {
    const errorObject = JSON.parse(error)

    // Todo:: delete when it's table enough
    try {
      onEventObject(ERROR_GET_MESSAGE, errorObject)
    } catch (e) {console.error(e)}

    if (
      errorObject.error
        && errorObject.error.details
        && errorObject.error.details.length
        && errorObject.error.details[0].message
    ) {
      return errorObject.error.details[0].message
    }

    if (errorObject.error && errorObject.error.what) {
      return errorObject.error.what
    }
  }

  if (error.message && error.message.error && typeOf(error.message.error) === 'Object' && error.message.error.code &&  error.message.error.name &&  error.message.error.what) {
    return error.message.error.what
  }

  return error.message || 'unknown error'
}

export const getEOSErrorMessage = (error: any) => {
  if (
    (typeOf(error) === 'Error' || typeOf(error) === 'Object')
      && error.message
      && error.message.indexOf('code') !== -1
      && error.message.indexOf('name') !== -1
      && error.message.indexOf('what') !== -1
      && error.message.indexOf('details') !== -1
  ) {
    const message = 'EOS System Error'
    const errorObject = JSON.parse(error.message)
    const eosError = errorObject.error
    if (!eosError) return { message: 'EOS System Error', detail: error }

    const code = eosError.code
    const name = eosError.name
    const what = eosError.what
    const details = eosError.details
    const detailsMessages =  details && details[0].message
    const detail = `[${code}] ${name}, ${what}, ${detailsMessages}.`
    return { message, detail }
  }

  if (
    typeof error === 'string'
      && error
      && error.indexOf('code') !== -1
      && error.indexOf('name') !== -1
      && error.indexOf('what') !== -1
      && error.indexOf('details') !== -1
  ) {
    const message = 'EOS System Error'
    const errorObject = JSON.parse(error)
    const eosError = errorObject.error
    if (!eosError) return { message: 'EOS System Error', detail: error }

    const code = eosError.code
    const name = eosError.name
    const what = eosError.what
    const details = eosError.details
    const detailsMessages = details && details[0].message
    const detail = `[${code}] ${name}, ${what}, ${detailsMessages}.`
    return { message, detail }
  }

  return error.message || 'unknown error'
}

export const parseEOSErrorMessage = (error: any) => {
  const message = error.message

  try {
    const parsed = JSON.parse(message)
    return parsed
  } catch(error) {
    return message
  }
}

export const escapeJSONString = (jsonString: string) => {
  return jsonString
    .replace(/[\\]/g, '\\\\')
    .replace(/[\"]/g, '\\\"')
    .replace(/[\']/g, '\\\'')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t')
}

export const parseMessageId = (text: string) => {
  const re = /BITPORAL_BRIDGE_MESSAGE@(\d|\w)+@/g
  const found = text.match(re)
  return found && found[0]
}

export const encodeKey = (...elements: any[]) => {
  const key = JSON.stringify([...elements])
  const keyTrim = key.substring(1, key.length - 1)
  return Buffer.from(keyTrim).toString('hex')
}

export const decodeKey = (key: string) => JSON.parse(`[${Buffer.from(key, 'hex').toString('utf8')}]`)

export const getPasswordStrength = (password: any) => {
  let passwordStrength = 0

  const hasUppercase = (value: string) => (/[A-Z]/.test(value))
  const hasLowercase = (value: string) => (/[a-z]/.test(value))
  const hasNumber = (value: string) => (/[0-9]/.test(value))
  const hasSymbol = (value: string) => (/[$&+,:;=?@#|'<>.^*()%!-]/.test(value))

  if (password && typeof password === 'string' && password.length >= 6) {
    if (hasLowercase(password)) passwordStrength += 1
    if (hasUppercase(password)) passwordStrength += 1
    if (hasNumber(password)) passwordStrength += 1
    if (hasSymbol(password)) passwordStrength += 1
  }

  return passwordStrength
}

export const noop = () => {}

export const eosQrString = (
  account_name: string,
  amount: number,
  token: string
) => `eos:${account_name}?amount=${amount || 0}&token=${token || 'EOS'}`

export const parseEOSQrString = (text: string) => {
  let eosAccountName
  let amount
  let token

  if (text && typeof text === 'string') {
    const account = text.split('?')[0]
    const queryString = text.split('?')[1]

    if (account && account.split(':')[1]) {
      if (account.split(':')[0] !== 'eos') return null

      eosAccountName = account.split(':')[1]

      if (queryString) {
        const queryObject: any = queryString
          .split('&')
          .map((item: any) => {
            if (
              item
                && typeof item === 'string'
                && item.split('=').length === 2
                && item.split('=')[0]
                && item.split('=')[1]
            ) {
              return { [item.split('=')[0]]: item.split('=')[1] }
            }

            return null
          })
          .filter((item: any) => !!item)
          .reduce((items, item) => ({ ...items, ...item }), {})

        amount = queryObject.amount
        token = queryObject.token && queryObject.token.toUpperCase()

        if (!token) return null
      }

      return { eosAccountName, amount, token }
    }

    return null
  }
}

export const filterBgColor = (data: string) => {
  if (data && parseFloat(data) > 0) {
    return Colors.bgColor_104_189_57
  } else if (data && parseFloat(data) < 0) {
    return Colors.bgColor_255_50_50
  }
  return Colors.bgColor_59_59_59
}

export const validateEOSActions = (actions: any, account: string) => {
  let errorMessage = ''

  actions.forEach((action: any) => {
    if (typeof action.account !== 'string' || typeof action.name !== 'string' || typeOf(action.data) !== 'Object' || typeOf(action.authorization) !== 'Array') {
      errorMessage = 'Invalid actions'
    }

    const authorizations = action.authorization

    authorizations.forEach((authorization: any) => {
      if (typeOf(authorization) !== 'Object') {
        errorMessage = 'Invalid authorization'
      } else if (authorization.actor !== account) {
        errorMessage = 'Authorization actor is not in BitPortal.'
      }
    })
  })

  return errorMessage
}

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }

  return true
}

export const hex_to_ascii = (str1: number) => {
  const hex = str1.toString()
  let str = ''

  for (let n = 0; n < hex.length; n += 2) {
	str += String.fromCharCode(parseInt(hex.substr(n, 2), 16))
  }
  return str
}

export const findDuplicate = (list: string[]) => {
  const uniq = list.map((name) => ({ count: 1, name: name }))
  .reduce((a, b) => {
    a[b.name] = (a[b.name] || 0) + b.count
    return a
  }, {})
  const duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)

  if (duplicates.length) {
    return duplicates[0]
  } else {
    return null
  }
}

export const getNameBySymbol = (symbol: string) => {
  if (symbol === 'BTC') {
    return 'Bitcoin'
  } else if (symbol === 'ETH') {
    return 'Etheruem'
  } else if (symbol === 'PCX') {
    return 'ChainX'
  } else {
    return symbol
  }
}

export const isURL = (text) => {
  const re_weburl = new RegExp(
    "^" +
      // protocol identifier (optional)
      // short syntax // still required
      "(?:(?:(?:https?|ftp):)?\\/\\/)" +
      // user:pass BasicAuth (optional)
      "(?:\\S+(?::\\S*)?@)?" +
      "(?:" +
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broadcast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
      "|" +
      // host & domain names, may end with dot
      // can be replaced by a shortest alternative
      // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
      "(?:" +
      "(?:" +
      "[a-z0-9\\u00a1-\\uffff]" +
      "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
      ")?" +
      "[a-z0-9\\u00a1-\\uffff]\\." +
      ")+" +
      // TLD identifier name, may end with dot
      "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
      ")" +
      // port number (optional)
      "(?::\\d{2,5})?" +
      // resource path (optional)
      "(?:[/?#]\\S*)?" +
      "$", "i"
  )

  return re_weburl.test(text)
}

export const transfromUrlText = (text) => {
  const valid = isURL(text)

  if (valid) {
    if (text.indexOf('//') === 0) {
      return 'http:' + text
    } else {
      return text
    }
  } else {
    return 'https://www.google.com/search?q=' + text
  }
}
