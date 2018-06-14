import './mobile'
import { ENV } from './shared/constants/env/index.mobile'

if (ENV == 'production') {
  global.console = {
    info:  () => {},
    log:   () => {},
    warn:  () => {},
    debug: () => {},
    error: () => {}
  }
}

if (ENV == 'production') {
  require('ErrorUtils').setGlobalHandler(function () {

  });
}