import Immutable from 'immutable'

export const getInitialContact = (presetContact?: string) => Immutable.fromJS({
  data: presetContact || []
})
