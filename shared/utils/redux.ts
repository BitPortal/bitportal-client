import produce from 'immer'
import { createAction, handleActions as raHandleActions } from 'redux-actions'

export const handleActions = (actions, state) => raHandleActions(
  Object.keys(actions).reduce((acc, key) => {
    acc[key] = produce(actions[key])

    return acc
  }, {}),
  state
)

export const createAsyncAction = (actionType: string) => ({
  requested: createAction(`${actionType}_REQUESTED`),
  succeeded: createAction(`${actionType}_SUCCEEDED`),
  refresh: createAction(`${actionType}_REFRESH`),
  failed: createAction(`${actionType}_FAILED`),
  clearError: createAction(`${actionType}_CLEAR_ERROR`),
  isAsync: true
})

export const createAsyncActionReducers = (actions: any) => {
  return handleActions({
    [actions.requested] (state: any) {
      state.loading = true
    },
    [actions.refresh] (state: any) {
      state.loading = true
      state.refreshing = true
    },
    [actions.succeeded] (state: any) {
      state.loading = false
      state.refreshing = false
      state.loaded = true
      state.error = null
    },
    [actions.failed] (state: any, action: any) {
      state.loading = false
      state.refreshing = false
      state.error = action.payload
    },
    [actions.clearError] (state: any) {
      state.error = null
    },
    [actions.reset] (state: any) {
      return {
        loading: false,
        refreshing: false,
        loaded: false,
        error: null
      }
    }
  }, { loading: false, refreshing: false, loaded: false, error: null })
}

export const getAsyncActions = (actions: any) => {
  const asyncActions = {}

  for (const key in actions) {
    if (actions[key].isAsync) {
      asyncActions[key] = actions[key]
    }
  }

  return asyncActions
}

export const createAsyncActionsReducers = (actions: any) => {
  const reducers = {}

  for (const key of Object.keys(actions)) {
    reducers[key] = createAsyncActionReducers(actions[key])
  }

  return reducers
}

function bindActionCreator(actionCreator, dispatch) {
  return function() {
    return dispatch(actionCreator.apply(this, arguments))
  }
}

export function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error(
      `bindActionCreators expected an object or a function, instead received ${
        actionCreators === null ? 'null' : typeof actionCreators
      }. ` +
        `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
    )
  }

  const keys = Object.keys(actionCreators)
  const boundActionCreators = {}
  for (const key of keys) {
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    } else if (typeof actionCreator === 'object') {
      boundActionCreators[key] = bindActionCreators(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
