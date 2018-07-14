import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/producer'

const initialState = Immutable.fromJS({
  data: {
    more: '',
    rows: [],
    total_producer_vote_weight: 0
  },
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
  },
  [actions.getProducersInfoRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getProducersInfoSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false).updateIn(['data', 'rows'], (v: any) => {
      return v.size ? v.map((producer: any) => {
        const owner = producer.get('owner')
        const info = action.payload[owner]
        return info ? producer.set('info', Immutable.fromJS(info)) : producer
      }).sortBy((v: any) => v.getIn(['info', 'weight']) ? -+v.getIn(['info', 'weight']) : 0) : v
    })
  },
  [actions.getProducersInfoFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  }
}, initialState)
