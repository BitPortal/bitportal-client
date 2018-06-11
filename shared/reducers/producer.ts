import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/producer'

const initialState = Immutable.fromJS({
  data: {
    more: '',
    rows: [],
    total_producer_vote_weight: 0
  },
  selected: [
    { name: '', location: 'Bvi', producer: '协作、创新、去中心化' },
    { name: 'BitFinex8', location: 'Bvi', producer: '协作、创新、去中心化' }
  ],
  loading: false,
  loaded: false,
  error: null
})

export default handleActions({
  [actions.getProducersRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getProducersSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false).set('data', Immutable.fromJS(action.payload))
  },
  [actions.getProducersFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  }
}, initialState)
