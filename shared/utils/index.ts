import Colors from 'resources/colors'

const multiple = (position: number): number => (!position ? 1 : 10 * multiple(position - 1))

export const roundDown = (value: number, decimal: number) => value && Math.floor(value * multiple(decimal)) / multiple(decimal)

export const roundUp = (value: number, decimal: number) => value && Math.ceil(value * multiple(decimal)) / multiple(decimal)

export const errorLoading = (err: string) => console.error('Dynamic page loading failed: ', err)

export const typeOf = (value: any) => Object.prototype.toString.call(value).slice(8, -1)

const loadedScripts: string[] = []

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
