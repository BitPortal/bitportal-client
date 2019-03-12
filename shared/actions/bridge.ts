import { createAction } from 'redux-actions'

export const receiveMessage = createAction<any>('bridge/RECEIVE_MESSAGE')
export const sendMessage = createAction<any>('bridge/SEND_MESSAGE')
export const pendMessage = createAction<BridgeMessage>('bridge/PEND_MESSAGE')
export const rejectMessage = createAction('bridge/REJECT_MESSAGE')
export const resolveMessage = createAction('bridge/RESOLVE_MESSAGE')
export const resolveMessageFinished = createAction('bridge/RESOLVE_MESSAGE_FAILED')
export const resolveMessageFailed = createAction<ErrorMessage>('bridge/RESOLVE_MESSAGE_FINISHED')
export const loadContract = createAction('bridge/LOAD_CONTRACT')
export const clearMessage = createAction('bridge/CLEAR_MESSAGE')
export const clearPasswordError = createAction('bridge/CLEAR_PASSWORD_ERROR')
export const setHost = createAction('bridge/SET_HOST')
