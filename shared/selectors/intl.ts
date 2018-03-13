import Immutable from 'immutable'
import cookie from 'react-cookie'
import { isMobile } from 'utils/platform'

export const getInitialLang = () => Immutable.fromJS({
  locale: !isMobile ? (cookie.load('dae_lang') || 'en') : 'en'
})
