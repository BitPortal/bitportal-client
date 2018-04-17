import Immutable from 'immutable'

export const getInitialLang = (presetLang?: string) => Immutable.fromJS({
  locale: presetLang || 'en'
})
