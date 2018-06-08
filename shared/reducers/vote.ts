import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/vote'

const initialState = Immutable.fromJS({
  data: [
    { name: 'EosLaoMao', location: '日本', producer: '区块链行业知名投资人老猫发起' },
    { name: 'BitFinex1', location: 'Bvi', producer: '协作、创新、去中心化' },
    { name: 'BitFinex2', location: 'Bvi', producer: '协作、创新、去中心化' },
    { name: 'BitFinex3', location: 'Bvi', producer: '协作、创新、去中心化' },
    { name: 'BitFinex4', location: 'Bvi', producer: '协作、创新、去中心化' },
    { name: 'BitFinex5', location: 'Bvi', producer: '协作、创新、去中心化' },
    { name: 'BitFinex6', location: 'Bvi', producer: '协作、创新、去中心化' },
    { name: 'BitFinex7', location: 'Bvi', producer: '协作、创新、去中心化' },
    { name: 'BitFinex8', location: 'Bvi', producer: '协作、创新、去中心化' },
  ],
  selectedProducers: [
    { name: 'BitFinex7', location: 'Bvi', producer: '协作、创新、去中心化' },
    { name: 'BitFinex8', location: 'Bvi', producer: '协作、创新、去中心化' }
  ],
  loading: false,
  loaded: false,
  error: null
})

export default handleActions({
  [actions.getVoteDataRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getVoteDataSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false).update('data', action.payload.data)
  },
  [actions.getVoteDataFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.selectProducer] (state, action) {
    return state.update('selectedProducers', (producers: any) => {
      let newProducers = producers
      const index = newProducers.findIndex((item: any) => item.get('name') == action.payload.name)
      if (index == -1) return newProducers.push(Immutable.fromJS(action.payload))
      else return newProducers.delete(index)
    })
  }
}, initialState)
