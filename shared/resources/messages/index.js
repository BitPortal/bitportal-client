import zh from './zh'
import en from './en'
import ko from './ko'

export default {
  zh,
  en,
  ko
}

global.t = (that = [], message: string, values?: { [key: string]: string }) => {
  const { intl } = that.props || {};
  if (intl) {
   return intl.formatMessage({ id: message }, values || {});
  }
  return message;
}

global.currentLocale = (that = []) => {
  const { intl } = that.props || {};
  const { locale } = intl || {};
  if (locale) {
    return locale;
  }
}
