import zh from './zh'
import zh_other from './zh_other'
import en from './en'
import en_other from './en_other'
import ko from './ko'

const zh_all = {...zh, ...zh_other};
const en_all = {...en, ...en_other};

export default {
  zh:zh_all,
  en:en_all,
  ko,
}

global.t = (that = [], message: string, values?: { [key: string]: string }) => {
  const { intl } = that.props || {};
  if (intl) {
   return intl.formatMessage({ id: message }, values || {});
  }
  return message;
}

global.currentLocale = (that = {}) => {
  const { intl } = that.props || {};
  const { locale } = intl || {};
  if (locale) {
    return locale;
  }
}

let localeData = 'en';
global.gCurrentLocale = () => {
  return localeData;
}
const setGlobalLoacale = (locale: Locale) => {
  localeData = locale;
}

global.gt = (message) => {
  if (localeData === 'zh') {
    return  zh_all[message] ? zh_all[message] : message;
  }
  return en_all[message] ? en_all[message] : message;
}

export {setGlobalLoacale};
