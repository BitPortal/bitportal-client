import { createAction, Action } from 'redux-actions'

export const init = createAction('socket/INIT')
export const stop = createAction('socket/STOP')
export const close = createAction('socket/CLOSE')
export const connectRequested = createAction('socket/CONNEC_REQUESTED')
export const connectSucceeded = createAction('socket/CONNECT_SUCCEEDED')
export const connectFailed = createAction('socket/CONNECT_FAILED')
export const authenticate = createAction<string>('socket/AUTHENTICATE')
export const logout = createAction('socket/LOGOUT')
export const subscribe = createAction<object>('socket/SUBSCRIBE')
export const addActionToQueue = createAction<Action<object>>('socket/ADD_ACTION_TO_QUEUE')
export const executeQueueActions = createAction('socket/EXECUTE_QUEUE_ACTIONS')
export const clearQueueActions = createAction('socket/CLEAR_QUEUE_ACTIONS')
