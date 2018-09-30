import Immutable from 'immutable'

export const getInitialContact = (presetContact?: any) => Immutable.fromJS({
  data: presetContact || []
})
