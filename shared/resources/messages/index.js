import zh from './zh'
import en from './en'
import ko from './ko'

import en_xbc from './en_xbc.json'
import cn_xbc from './cn_xbc.json'


const zh_all = {...zh, ...cn_xbc};
const en_all = {...en, ...en_xbc};

export const defaultLocale = 'zh'

const locales = {
  zh:zh_all,
  en:en_all,
  ko,
}

export default locales

global.t = (that = [], message, values) => {

  if (!(zh_all[message] || en_all[message])){
    return message//`${message}_暂无翻译`
  }

  const { intl } = that.props || {};
  if (intl) {
   return intl.formatMessage({ id: message }, values || {});
  }
  return gt(message);
}

global.currentLocale = (that = {}) => {
  const { intl } = that.props || {};
  const { locale } = intl || {};
  if (locale) {
    return locale;
  }
}

let localeData = defaultLocale;
global.gCurrentLocale = () => {
  return localeData;
}
const setGlobalLoacale = (locale) => {
  localeData = locale;
}

global.gt = (message) => {

  if (!(zh_all[message] || en_all[message])){
    return message//`${message}_暂无翻译`
  }

  if (localeData === 'zh') {
    return  zh_all[message] ? zh_all[message] : message;
  }
  return en_all[message] ? en_all[message] : message;
}

export {setGlobalLoacale};
