import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/whiteList'

const initialState = Immutable.fromJS({
  data: {},
  loading: false,
  loaded: false,
  error: null
})

export default handleActions(
  {
    
  },
  initialState
)
