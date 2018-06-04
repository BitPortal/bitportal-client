import './mobile'

if (!__DEV__) {
  global.console = {
    info:  () => {},
    log:   () => {},
    warn:  () => {},
    debug: () => {},
    error: () => {}
  }
}