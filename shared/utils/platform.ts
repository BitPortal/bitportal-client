const isBrowser: boolean = typeof document !== 'undefined'
const isServer: boolean = typeof process !== 'undefined' && !!(process as Process).release && (process as Process).release.name === 'node'
const isMobile: boolean = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
const isWeb: boolean = isBrowser || isServer
const isDesktop: boolean = typeof window !== 'undefined' && window && window.process && window.process.type

const getPlatform = () => {
  if (isBrowser) return 'browser'
  if (isServer) return 'server'
  if (isMobile) return 'mobile'
  if (isDesktop) return 'desktop'

  return 'unknown'
}

export { isBrowser, isServer, isMobile, isWeb, isDesktop, getPlatform }
