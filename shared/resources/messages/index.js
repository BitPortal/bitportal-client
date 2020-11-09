import zh from './zh'
import zh_other from './zh_other'
import en from './en'
import en_other from './en_other'
import ko from './ko'

import en_enk from './en_enk.json'
import zh_enk from './zh_enk.json'


const zh_all = {...zh, ...zh_other,...zh_enk};
const en_all = {...en, ...en_other,...en_enk};

export default {
  zh:zh_all,
  en:en_all,
  ko,
}

global.t = (that = [], message, values) => {
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
const setGlobalLoacale = (locale) => {
  localeData = locale;
}

global.gt = (message) => {
  if (localeData === 'zh') {
    return  zh_all[message] ? zh_all[message] : message;
  }
  return en_all[message] ? en_all[message] : message;
}

export {setGlobalLoacale};
