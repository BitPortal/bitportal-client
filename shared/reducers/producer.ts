import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/producer'
import { sortProducers } from 'core/eos'

const initialState = Immutable.fromJS({
  data: {
    more: '',
    rows: [],
    total_producer_vote_weight: 0
  },
  selected: [],
  loading: false,
  loaded: false,
  error: null,
  sortType: 'default'
})

export default handleActions({
  [actions.getProducersWithInfoRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getProducersWithInfoSucceeded] (state, action) {
    const sortType = state.get('sortType')
    return state.set('loaded', true).set('loading', false)
      .setIn(['data', 'total_producer_vote_weight'], action.payload.total_producer_vote_weight)
      .setIn(['data', 'more'], action.payload.more)
      .setIn(['data', 'rows'], Immutable.fromJS(action.payload.rows).sortBy((v: any) => sortType === 'default' ? (v.getIn(['info', 'weight']) ? -+v.getIn(['info', 'weight']) : 0) : -+v.get('total_votes')))
  },
  [actions.getProducersWithInfoFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
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
    const sortType = state.get('sortType')
    return state.set('loaded', true).set('loading', false).updateIn(['data', 'rows'], (v: any) => {
      return v.size ? v.map((producer: any) => {
        const owner = producer.get('owner')
        const info = action.payload[owner]
        return info ? producer.set('info', Immutable.fromJS(info)) : producer
      }).sortBy((v: any) => sortType === 'default' ? (v.getIn(['info', 'weight']) ? -+v.getIn(['info', 'weight']) : 0) : -+v.get('total_votes')) : v
    })
  },
  [actions.getProducersInfoFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.sortProducers] (state, action) {
    const sortType = action.payload
    return state.set('sortType', sortType).set('loaded', true).set('loading', false).updateIn(['data', 'rows'], (v: any) => {
      return (v.size && (sortType === 'default' || sortType === 'ranking')) ? v.sortBy((v: any) => sortType === 'default' ? (v.getIn(['info', 'weight']) ? -+v.getIn(['info', 'weight']) : 0) : -+v.get('total_votes')) : v
    })
  },
  [actions.toggleSelect] (state, action) {
    const selected = state.get('selected').includes(action.payload)
    const size = state.get('selected').size

    if (size < 30 && !selected) {
      return state.update('selected', (v: any) => v.push(action.payload).sort(sortProducers))
    } else if (size <= 30 && selected) {
      return state.update('selected', (v: any) => v.filter((v: any) => v !== action.payload).sort(sortProducers))
    } else {
      return state
    }
  },
  [actions.setSelected] (state, action) {
    return state.set('selected', action.payload)
  },
}, initialState)
