const isBrowser: boolean = typeof document !== 'undefined'
const isServer: boolean = typeof process !== 'undefined' && !!(process as Process).release && (process as Process).release.name === 'node'
const isMobile: boolean = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
const isWeb = isBrowser || isServer

export { isBrowser, isServer, isMobile, isWeb }
