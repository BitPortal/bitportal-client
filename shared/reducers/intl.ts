import { handleActions } from 'redux-actions'
import { getInitialLang } from 'selectors/intl'
import * as actions from 'actions/intl'

export default handleActions({
  [actions.setLocale] (state, action) {
    return state.set('locale', action.payload)
  }
}, getInitialLang())
