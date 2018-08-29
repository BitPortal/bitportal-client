import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/dApp'

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null,
  searchTerm: '',
  favoriteDapps: [],
  selected: undefined
})

export default handleActions(
  {
    [actions.getDappListRequested](state) {
      return state.set('loading', true)
    },
    [actions.getDappListSucceeded](state, action) {
      return state
        .set('loaded', true)
        .set('loading', false)
        .set(
          'data',
          action.payload.length === 0
            ? Immutable.fromJS({})
            : Immutable.fromJS(action.payload)
        )
    },
    [actions.getDappListFailed](state, action) {
      return state.set('error', action.payload).set('loading', false)
    },
    [actions.setSearchTerm](state, action) {
      return state.set('searchTerm', Immutable.fromJS(action.payload))
    },
    [actions.toggleFavoriteDapp](state, action) {
      console.log('toggle', action.payload)
      return state
        .set('selected', action.payload.selected)
        .update('favoriteDapps', (item: any) => {
          const name = action.payload.item.get('name')
          const index = item.findIndex((elem: any) => elem.get('name') === name)
          if (index === -1) {
            return item.push(action.payload.item.set('selected', true))
          } else return item.delete(index)
        })
    }
  },
  initialState
)
