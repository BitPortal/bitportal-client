import Immutable from 'immutable'
import storage from 'utils/storage'

export const getInitialLang = () => Immutable.fromJS({
  locale: storage.getItem('dae_lang') || 'en'
})
