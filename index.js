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

if (!__DEV__) {
  require('ErrorUtils').setGlobalHandler(function () {

  });
}