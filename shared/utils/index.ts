const multiple = (position: number): number => (!position ? 1 : (10 * multiple(position - 1)))

export const roundDown = (value: number, decimal: number) => (value && (Math.floor(value * multiple(decimal)) / multiple(decimal)))

export const roundUp = (value: number, decimal: number) => (value && (Math.ceil(value * multiple(decimal)) / multiple(decimal)))

export const errorLoading = (err: string) => console.error('Dynamic page loading failed: ', err)

export const typeOf = (value: any) => Object.prototype.toString.call(value).slice(8, -1)

const loadedScripts: string[] = []

export const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
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
}

export const getErrorMessage = (error: any) => {
  try {
    if (typeof error === 'string') {
      return JSON.parse(error).message
    } else if (typeOf(error) === 'Error') {
      return JSON.parse(error.message).message
    }

    return error.message
  } catch (error) {
    return error.message
  }

}

export const encodeKey = (...elements: any[]) => {
  const key = JSON.stringify(['info', ...elements])
  const keyTrim = key.substring(1, key.length - 1)
  return Buffer.from(keyTrim).toString('hex')
}

export const encodeKeyStoreKey = (...elements: any[]) => {
  const key = JSON.stringify(['kstor', ...elements])
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
