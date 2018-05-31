import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/vote'

const initialState = Immutable.fromJS({
  data: [
    { name: 'EosLaoMao', location: '日本', producer: '区块链行业知名投资人老猫发起', totalVotes: 12324123 },
    { name: 'BitFinex', location: 'Bvi', producer: '协作、创新、去中心化', totalVotes: 512321 },
    { name: 'BitFinex', location: 'Bvi', producer: '协作、创新、去中心化', totalVotes: 512321 },
    { name: 'BitFinex', location: 'Bvi', producer: '协作、创新、去中心化', totalVotes: 512321 },
    { name: 'BitFinex', location: 'Bvi', producer: '协作、创新、去中心化', totalVotes: 512321 },
    { name: 'BitFinex', location: 'Bvi', producer: '协作、创新、去中心化', totalVotes: 512321 },
    { name: 'BitFinex', location: 'Bvi', producer: '协作、创新、去中心化', totalVotes: 512321 },
    { name: 'BitFinex', location: 'Bvi', producer: '协作、创新、去中心化', totalVotes: 512321 },
    { name: 'BitFinex', location: 'Bvi', producer: '协作、创新、去中心化', totalVotes: 512321 },
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
  }
}, initialState)